import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { getPostBySlug, getAllPosts, getAllCategories } from '@/utils/blog'
import type { BlogLang } from '@/types'
import type { BlogPost as BlogPostType } from '@/types'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined
  const [lang, setLang] = useState<BlogLang>('zh')

  if (!post) {
    // If post not found, redirect to blog list
    return <Navigate to="/blog" replace />
  }

  const isBilingual = post.contentEn.trim().length > 0
  const title = lang === 'en' && post.titleEn ? post.titleEn : post.title
  const body: BlogPostType = post
  const categories = getAllCategories()
  const categoryLabel = (key: string) =>
    lang === 'en'
      ? categories.find((c) => c.key === key)?.labelEn ?? key
      : categories.find((c) => c.key === key)?.labelZh ?? key

  return (
    <article className="py-16">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <time className="text-sm text-slate-500">{post.date}</time>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-sm text-slate-500">{post.readingTime}</span>
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-500"
                >
                  {categoryLabel(cat)}
                </span>
              ))}
            </div>

            {isBilingual && (
              <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200 text-xs font-medium dark:border-slate-700">
                <button
                  onClick={() => setLang('zh')}
                  className={`px-3 py-1.5 transition-colors ${
                    lang === 'zh'
                      ? 'bg-primary-500 text-white'
                      : 'bg-transparent text-slate-500 hover:text-primary-500'
                  }`}
                >
                  中
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 transition-colors ${
                    lang === 'en'
                      ? 'bg-primary-500 text-white'
                      : 'bg-transparent text-slate-500 hover:text-primary-500'
                  }`}
                >
                  EN
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="mx-auto mt-8 max-w-3xl border-t border-slate-200/50 dark:border-slate-800/50" />

        {/* Markdown Content */}
        <div className="prose-custom mx-auto mt-8 max-w-3xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {lang === 'en' ? body.contentEn : body.contentZh}
          </ReactMarkdown>
        </div>

        {/* Navigation Footer */}
        <div className="mx-auto mt-12 max-w-3xl border-t border-slate-200/50 pt-8 dark:border-slate-800/50">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white shadow-md shadow-primary-500/25 transition-all hover:bg-primary-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            View All Posts
          </Link>
        </div>
      </div>
    </article>
  )
}
