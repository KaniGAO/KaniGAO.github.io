import { BlogPost } from '@/types'

// Blog posts are imported as raw markdown strings
// This is a placeholder - in production, these would be actual .md files
const blogModules = import.meta.glob('/src/content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(blogModules).map(([path, content]) => {
    // Extract slug from path: /src/content/blog/YYYY-MM-DD-slug.md -> slug
    const match = path.match(/(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
    const date = match?.[1] || new Date().toISOString().split('T')[0]
    const slug = match?.[2] || 'untitled'
    const textContent = content as string

    // Extract excerpt (first paragraph or first ~150 chars)
    const plainText = textContent
      .replace(/^---[\s\S]*?---/, '')
      .replace(/[#*`\[\]()]/g, '')
      .trim()
    const excerpt =
      plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '')

    // Extract title from first H1 or use slug
    const titleMatch = textContent.match(/^#\s+(.+)$/m)
    const title = titleMatch?.[1] || slug.replace(/-/g, ' ')

    // Extract tags from frontmatter or default
    const tagsMatch = textContent.match(/tags:\s*\[([\s\S]*?)\]/)
    const tags: string[] = tagsMatch
      ? tagsMatch[1].split(',').map((t) => t.trim().replace(/['"]/g, ''))
      : ['未分类']

    return {
      slug,
      title,
      date,
      excerpt,
      tags,
      content: textContent,
      readingTime: calculateReadingTime(textContent),
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
