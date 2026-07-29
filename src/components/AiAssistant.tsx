import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_QUESTIONS = [
  {
    question: 'What is the Sharpe Ratio?',
    answer:
      'The Sharpe Ratio measures the excess return per unit of total risk for a portfolio. Formula: SR = (Rp - Rf) / σp, where Rp is the portfolio\'s annualized return, Rf is the risk-free rate, and σp is the annualized volatility. Generally, SR > 1 is considered good, > 2 is excellent.',
  },
  {
    question: 'Recommend a low-risk arbitrage strategy',
    answer:
      'ETF premium/discount arbitrage is a relatively low-risk strategy. When the ETF market price is below its NAV (discount), buy ETF and redeem to get the basket of stocks and sell them; when above NAV (premium), buy the basket of stocks and subscribe ETF then sell. This requires sufficient capital and fast execution systems. Always validate with a paper trading account first.',
  },
]

export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm a Kani OS 助手. I can answer questions about quantitative strategies, risk management, and financial engineering. Try the quick questions below!",
    },
  ])
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setShowHint(false)
  }, [open])

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

  const addAssistantMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: 'assistant' as const, content: text }])
  }

  const handleQuickQuestion = (qa: (typeof QUICK_QUESTIONS)[number]) => {
    setMessages((prev) => [...prev, { role: 'user', content: qa.question }])
    setTimeout(() => addAssistantMessage(qa.answer), 400)
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setTimeout(
      () =>
        addAssistantMessage(
          'AI API is under development — auto-replies are not available yet. Your message has been logged.'
        ),
      300
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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

  const panel = open ? (
    <div
      ref={panelRef}
      className="fixed bottom-24 right-6 z-50 flex w-[320px] flex-col rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/90 sm:w-[360px]"
      style={{ maxHeight: '520px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/50 px-5 py-3 dark:border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon to-primary-500 text-xs font-bold text-white">
            Q
          </div>
          <span className="text-sm font-semibold">Kani OS 助手</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3" style={{ maxHeight: '320px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      {showHint && (
        <div className="flex flex-wrap gap-2 border-t border-slate-200/50 px-4 py-3 dark:border-slate-700/50">
          {QUICK_QUESTIONS.map((qa, i) => (
            <button
              key={i}
              onClick={() => {
                setShowHint(false)
                handleQuickQuestion(qa)
              }}
              className="rounded-full border border-primary-500/30 px-3 py-1 text-xs font-medium text-primary-600 transition-all hover:bg-primary-500/10 dark:text-primary-400"
            >
              {qa.question}
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
          placeholder="Ask a question..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white transition-all hover:bg-primary-600 disabled:opacity-40"
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
