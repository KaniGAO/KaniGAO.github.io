import { useState, useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { projectsData, type Project } from '@/data/projectsData'

const ALL_TAGS = ['All', 'Python', 'Quant', 'AI Agent', 'Dify', 'Bloomberg', 'Alpha Research', 'Factor', 'Finance', 'Database', 'Stat-Arb', 'Risk', 'Monte Carlo'] as const

export default function Projects() {
  const [activeTag, setActiveTag] = useState<string>('All')

  const filtered = useMemo(() => {
    if (activeTag === 'All') return projectsData
    return projectsData.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()))
    )
  }, [activeTag])

  return (
    <div className="py-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Projects</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Quant research, backtesting systems, and financial engineering work.
          </p>
        </div>

        {/* Tag Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTag === tag
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            No projects found.
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-200/60 bg-white/10 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-gray-700/60 dark:bg-black/30 dark:hover:border-indigo-400/50">
      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-indigo-500">
          {project.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 border-t border-gray-200/50 pt-3 dark:border-gray-700/50">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-indigo-500 dark:text-gray-400"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Code</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-indigo-500 dark:text-gray-400"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
