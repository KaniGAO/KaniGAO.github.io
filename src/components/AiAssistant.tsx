import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X, Send, Settings, Lock, Loader2 } from 'lucide-react'
import { buildSystemPrompt } from '@/lib/assistantContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AiConfig {
  baseUrl: string
  apiKey: string
  model: string
}

const CONFIG_KEY = 'kani-ai-config'
const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const DEFAULT_MODEL = 'deepseek-chat'

interface ProviderPreset {
  id: string
  label: string
  baseUrl: string
  model: string
}

const PROVIDERS: ProviderPreset[] = [
  { id: 'deepseek', label: 'DeepSeek', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
  {
    id: 'qwen',
    label: 'Qwen (通义千问)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
  },
  { id: 'custom', label: 'Custom / 自定义', baseUrl: '', model: '' },
]

function detectProvider(baseUrl: string): string {
  const b = baseUrl.trim()
  if (b.includes('deepseek.com')) return 'deepseek'
  if (b.includes('dashscope.aliyuncs.com')) return 'qwen'
  return 'custom'
}

// Site-provided shared key proxy (EdgeOne Pages). Empty = disabled.
// Deploy proxy/functions/api/chat.js to EdgeOne, then paste the URL here, e.g.:
//   https://<your-project>.edgeone.app/api/chat
// The real key lives ONLY in EdgeOne's secret env vars — never in this repo or the browser.
const SITE_PROXY_URL = 'https://kani-ai-proxy-ho0jyfnh.edgeone.cool/api/chat'
const SITE_PROXY_MODEL = 'qwen-plus'

function loadConfig(): AiConfig {
  const raw = localStorage.getItem(CONFIG_KEY)
  if (!raw) return { baseUrl: DEFAULT_BASE_URL, apiKey: '', model: DEFAULT_MODEL }
  const parsed = JSON.parse(raw) as Partial<AiConfig>
  return {
    baseUrl: parsed.baseUrl || DEFAULT_BASE_URL,
    apiKey: parsed.apiKey || '',
    model: parsed.model || DEFAULT_MODEL,
  }
}

const QUICK_QUESTIONS = [
  'Who is Kani and what does he do?',
  '介绍一下 Kani 做过的 AI Agent 项目',
]

const FAQ_FALLBACK =
  "AI chat isn't available yet — the site proxy isn't configured, and no API key is set. Open Settings (gear icon) and paste an OpenAI-compatible key (e.g. Qwen / DeepSeek) to enable real AI chat. Your key stays in this browser only."

export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [config, setConfig] = useState<AiConfig>(loadConfig)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Kani's site assistant. I know his projects, experience and this repo's structure — ask me anything. AI is powered by a site-provided key, so no setup is needed. You can also add your own key in Settings (gear icon).",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const btn = document.getElementById('ai-assist-btn')
        if (btn && btn.contains(e.target as Node)) return
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const saveConfig = (next: AiConfig) => {
    setConfig(next)
    localStorage.setItem(CONFIG_KEY, JSON.stringify(next))
  }

  const addAssistant = (text: string) =>
    setMessages((prev) => [...prev, { role: 'assistant' as const, content: text }])

  const callLlm = async (history: Message[]) => {
    setLoading(true)
    const payloadMessages = [
      { role: 'system', content: buildSystemPrompt() },
      ...history.slice(-8),
    ]

    let url: string
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (config.apiKey) {
      // Visitor supplied their own key → call provider directly
      const base = config.baseUrl.replace(/\/+$/, '')
      url = `${base}/chat/completions`
      headers.Authorization = `Bearer ${config.apiKey}`
    } else if (SITE_PROXY_URL) {
      // Site-provided shared key (hidden inside the EdgeOne proxy)
      url = SITE_PROXY_URL
    } else {
      setLoading(false)
      setTimeout(() => addAssistant(FAQ_FALLBACK), 300)
      return
    }

    const model = config.apiKey ? config.model : SITE_PROXY_MODEL

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, messages: payloadMessages, temperature: 0.5, max_tokens: 600 }),
    }).catch((err) => {
      console.error('AI request failed:', err)
      return null
    })

    if (!res) {
      addAssistant('Network / CORS error — check the API endpoint in Settings.')
    } else if (res.status === 401 || res.status === 403) {
      addAssistant('Authentication failed (401/403) — the site proxy key may be misconfigured, or check your own key in Settings.')
    } else if (!res.ok) {
      addAssistant(`Request failed (${res.status}) — check the proxy / model configuration.`)
    } else {
      const data = await res.json().catch(() => null)
      const reply = data?.choices?.[0]?.message?.content
      if (reply) addAssistant(reply)
      else addAssistant('Unexpected response format from the API.')
    }
    setLoading(false)
  }

  const sendText = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const nextHistory = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(nextHistory)
    setInput('')
    setShowHint(false)
    if (config.apiKey || SITE_PROXY_URL) {
      void callLlm(nextHistory)
    } else {
      setTimeout(() => addAssistant(FAQ_FALLBACK), 300)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendText(input)
    }
  }

  const floatBtn = (
    <button
      id="ai-assist-btn"
      onClick={() => setOpen(!open)}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-neon to-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-primary-500/40"
      aria-label="Open Kani OS 助手"
    >
      {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
    </button>
  )

  const settingsPanel = showSettings && (
    <div className="space-y-2.5 border-b border-slate-200/50 px-4 py-3 dark:border-slate-700/50">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Provider 预设
        </span>
        <select
          value={detectProvider(config.baseUrl)}
          onChange={(e) => {
            const p = PROVIDERS.find((x) => x.id === e.target.value)
            if (p && p.id !== 'custom') saveConfig({ ...config, baseUrl: p.baseUrl, model: p.model })
          }}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          API Base URL
        </span>
        <input
          type="text"
          value={config.baseUrl}
          onChange={(e) => saveConfig({ ...config, baseUrl: e.target.value })}
          placeholder={DEFAULT_BASE_URL}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          API Key
        </span>
        <input
          type="password"
          value={config.apiKey}
          onChange={(e) => saveConfig({ ...config, apiKey: e.target.value })}
          placeholder="sk-..."
          autoComplete="off"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Model
        </span>
        <input
          type="text"
          value={config.model}
          onChange={(e) => saveConfig({ ...config, model: e.target.value })}
          placeholder={DEFAULT_MODEL}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
      </label>
      <p className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
        <Lock className="mt-0.5 h-3 w-3 shrink-0" />
        Key is stored only in this browser (localStorage) — never uploaded or committed to the repo.
      </p>
    </div>
  )

  const panel = open ? (
    <div
      ref={panelRef}
      className="fixed bottom-24 right-6 z-50 flex w-[320px] flex-col rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/90 sm:w-[360px]"
      style={{ maxHeight: '560px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/50 px-5 py-3 dark:border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon to-primary-500 text-xs font-bold text-white">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Kani OS 助手</span>
            <span className="text-[10px] text-slate-400">
              {config.apiKey ? `AI · ${config.model}` : SITE_PROXY_URL ? 'AI · site key' : 'no key — settings →'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-lg p-1.5 transition-colors ${
              showSettings
                ? 'bg-primary-500/10 text-primary-500'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'
            }`}
            aria-label="Assistant settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {settingsPanel}

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3" style={{ maxHeight: '300px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3.5 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      {showHint && (
        <div className="flex flex-wrap gap-2 border-t border-slate-200/50 px-4 py-3 dark:border-slate-700/50">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendText(q)}
              className="rounded-full border border-primary-500/30 px-3 py-1 text-xs font-medium text-primary-600 transition-all hover:bg-primary-500/10 dark:text-primary-400"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-slate-200/50 px-4 py-3 dark:border-slate-700/50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={config.apiKey || SITE_PROXY_URL ? 'Ask about Kani…' : 'Set an API key to enable AI chat…'}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
        <button
          onClick={() => sendText(input)}
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : null

  return createPortal(
    <>
      {floatBtn}
      {panel}
    </>,
    document.body
  )
}
