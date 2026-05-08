import { useState } from 'react'
import { projects } from '@/data/projects'

type Category = Project['category'] | 'all'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'frontend', label: '前端' },
  { value: 'backend', label: '后端' },
  { value: 'fullstack', label: '全栈' },
  { value: 'tool', label: '工具' },
]

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'bg-blue-500/10 text-blue-500',
  backend: 'bg-green-500/10 text-green-500',
  fullstack: 'bg-purple-500/10 text-purple-500',
  tool: 'bg-orange-500/10 text-orange-500',
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="py-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">项目展示</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            精选项目与技术实践
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((project, index) => (
            <article
              key={project.id}
              className="card-base group p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[project.category]}`}>
                  {CATEGORIES.find(c => c.value === project.category)?.label}
                </span>
                <div className="flex gap-2">
                  {project.repoUrl && project.repoUrl !== '#' && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                      aria-label="源码"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {project.demoUrl && project.demoUrl !== '#' && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                      aria-label="演示"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary-500 transition-colors">
                {project.title}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            暂无该分类下的项目
          </div>
        )}
      </div>
    </div>
  )
}
