import { useState, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { Link } from 'react-router-dom'
import { getSortedPosts } from '@/utils/blog'
import type { BlogLang } from '@/types'

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [lang, setLang] = useState<BlogLang>('zh')
  const posts = useMemo(() => getSortedPosts(), [])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return posts
    const query = searchQuery.toLowerCase()
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.excerpt.toLowerCase().includes(query)
    )
  }, [posts, searchQuery])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  }, [posts])

  return (
    <div className="py-16">
      <div className="container-custom">
        <PageHeader
          eyebrow="Writing"
          title="Blog"
          subtitle="Thoughts on quantitative finance, risk management, and technology."
        />

        {/* Language Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="flex overflow-hidden rounded-lg border border-slate-200 text-sm font-medium dark:border-slate-700">
            <button
              onClick={() => setLang('zh')}
              className={`px-4 py-1.5 transition-colors ${
                lang === 'zh'
                  ? 'bg-primary-500 text-white'
                  : 'bg-transparent text-slate-500 hover:text-primary-500'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 transition-colors ${
                lang === 'en'
                  ? 'bg-primary-500 text-white'
                  : 'bg-transparent text-slate-500 hover:text-primary-500'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto mb-10 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-primary-500 hover:text-primary-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => {
            const cardTitle =
              lang === 'en' && post.titleEn ? post.titleEn : post.title
            const cardExcerpt =
              lang === 'en' && post.excerptEn ? post.excerptEn : post.excerpt
            return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="card-base group p-6 animate-fade-in"
            >
              <time className="text-xs text-slate-500">{post.date}</time>
              <h2 className="mt-2 mb-3 text-lg font-semibold group-hover:text-primary-500 transition-colors line-clamp-2">
                {cardTitle}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                {cardExcerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{post.readingTime}</span>
                <div className="flex gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-500/10 px-2 py-0.5 text-xs text-primary-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-slate-500 dark:text-slate-400">No posts found.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-sm text-primary-500 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
