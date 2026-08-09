import { BlogPost } from '@/types'

interface MatterResult {
  data: Record<string, unknown>
  content: string
}

/** 简单的 frontmatter 解析器，避免 gray-matter 的 Buffer 依赖 */
function parseFrontmatter(raw: string): MatterResult {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, unknown> = {}
  const metaLines = match[1].split('\n')
  for (const line of metaLines) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()

    // 处理数组值 [a, b] 或带引号的字符串
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      continue
    }
    // 去除引号
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    data[key] = val
  }

  return { data, content: match[2].trim() }
}

/** 标签 → 顶层分类 key 的映射表。旧的散标签自动归入 4 个分类。 */
const CATEGORY_MAP: Record<string, string> = {
  // AI Agent
  'AI Agent': 'ai-agent',
  Dify: 'ai-agent',
  'Agentic Workflow': 'ai-agent',
  CodeBuddy: 'ai-agent',
  Feishu: 'ai-agent',
  '文档自动化': 'ai-agent',
  'Cross-border E-commerce': 'ai-agent',
  // 量化金融
  Quant: 'quant',
  Quantitative: 'quant',
  'Risk Management': 'quant',
  Tushare: 'quant',
  // 工程实践
  FastAPI: 'engineering',
  Python: 'engineering',
  Vite: 'engineering',
  调试: 'engineering',
  '本地开发': 'engineering',
  部署: 'engineering',
  DevOps: 'engineering',
  // 研发协作
  Git: 'git-devops',
  GitHub: 'git-devops',
  SSH: 'git-devops',
  '版本控制': 'git-devops',
}

/** 分类 key → 展示文字（中/英）与排序。 */
const CATEGORY_META: { key: string; labelZh: string; labelEn: string }[] = [
  { key: 'ai-agent', labelZh: 'AI Agent', labelEn: 'AI Agent' },
  { key: 'quant', labelZh: '量化金融', labelEn: 'Quant' },
  { key: 'engineering', labelZh: '工程实践', labelEn: 'Engineering' },
  { key: 'git-devops', labelZh: '研发协作', labelEn: 'Git & DevOps' },
]

const CATEGORY_ORDER = CATEGORY_META.map((c) => c.key)

/** 由 tags 推导分类（去重 + 固定顺序），无匹配分类时为空数组。 */
function deriveCategories(tags: string[]): string[] {
  const set = new Set<string>()
  for (const tag of tags) {
    const key = CATEGORY_MAP[tag]
    if (key) set.add(key)
  }
  return CATEGORY_ORDER.filter((k) => set.has(k))
}

/** 返回 4 个顶层分类的元信息，供首页筛选栏使用。 */
export function getAllCategories(): { key: string; labelZh: string; labelEn: string }[] {
  return CATEGORY_META
}

const blogModules = import.meta.glob('/src/content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function calculateReadingTime(content: string): string {
  const cnChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
  const enWords = content.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).length
  const total = cnChars / 3 + enWords
  const minutes = Math.max(1, Math.ceil(total / 200))
  return `${minutes} 分钟阅读`
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(blogModules).map(([path, raw]) => {
    const content = raw as string
    const { data, content: markdown } = parseFrontmatter(content)

    // Extract slug from path: /src/content/blog/YYYY-MM-DD-slug.md -> slug
    const match = path.match(/(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
    const date: string =
      (data.date as string) || match?.[1] || new Date().toISOString().split('T')[0]
    const slug = match?.[2] || 'untitled'
    const title = (data.title as string) || slug.replace(/-/g, ' ')
    const tags: string[] = (Array.isArray(data.tags) ? data.tags : []) as string[]
    const categories = deriveCategories(tags)
    const description: string =
      (data.description as string) ||
      markdown
        .replace(/[#*`\[\]()>]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 200) + '...'
    const descriptionEn: string = (data.descriptionEn as string) || ''

    // Split content into Chinese (zh) and English (en) bodies on the marker.
    const LANG_SPLIT = '<!--lang:en-->'
    let contentZh = markdown
    let contentEn = ''
    const splitIdx = markdown.indexOf(LANG_SPLIT)
    if (splitIdx !== -1) {
      contentZh = markdown.slice(0, splitIdx).trim()
      contentEn = markdown.slice(splitIdx + LANG_SPLIT.length).trim()
    }

    return {
      slug,
      title,
      titleEn: (data.titleEn as string) || undefined,
      date,
      excerpt: description,
      excerptEn: descriptionEn,
      tags,
      categories,
      content: markdown,
      contentZh,
      contentEn,
      readingTime: calculateReadingTime(markdown),
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

export function getSortedPosts(): BlogPost[] {
  return [...getAllPosts()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
