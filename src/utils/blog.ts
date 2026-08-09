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
