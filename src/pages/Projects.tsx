import { useState, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { ExternalLink, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '@/data/projects'
import { Project } from '@/types'
import TagList from '@/components/TagList'

// Only surface work flagged for the Projects view (single source of truth).
const projectProjects = projects.filter((p) => p.roles?.includes('project'))

// Unique filter chips: { label, kind } derived from every project's tags.
const ALL_PROJECT_TAGS = Array.from(
  new Map(
    projectProjects
      .flatMap((p) => p.tags)
      .map((t) => [t.label, { label: t.label, kind: t.kind }] as const)
  ).values()
)

// Split into Tech / Domain groups for a clean, grouped filter bar.
const TECH_TAGS = ALL_PROJECT_TAGS.filter((t) => t.kind === 'tech')
const DOMAIN_TAGS = ALL_PROJECT_TAGS.filter((t) => t.kind === 'domain')

export default function Projects() {
  const [activeTag, setActiveTag] = useState<string>('All')

  const filtered = useMemo(() => {
    if (activeTag === 'All') return projectProjects
    return projectProjects.filter((p) =>
      p.tags.some((t) => t.label.toLowerCase().includes(activeTag.toLowerCase()))
    )
  }, [activeTag, projectProjects])

  const filterColor = (tag: { label: string; kind: 'tech' | 'domain' | 'all' }) => {
    if (activeTag !== tag.label) {
      return 'bg-white/60 text-slate-600 hover:bg-white dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
    }
    if (tag.kind === 'domain') return 'bg-neon text-white shadow-glow-red'
    if (tag.kind === 'tech') return 'bg-primary-500 text-white shadow-glow-red'
    return 'bg-neon text-white shadow-glow-red'
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <PageHeader
          eyebrow="Projects"
          title="Projects"
          subtitle="Quant research, backtesting systems, and financial engineering work."
        />

        {/* Tag Filter — grouped by Tech / Domain */}
        <div className="mb-4 flex flex-col items-center gap-3">
          {/* All + Tech group */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTag('All')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filterColor({ label: 'All', kind: 'all' })}`}
            >
              All
            </button>
            {TECH_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => setActiveTag(tag.label)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filterColor(tag)}`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Domain group */}
          <div className="flex flex-wrap justify-center gap-2">
            {DOMAIN_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => setActiveTag(tag.label)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filterColor(tag)}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> Tech stack
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neon" /> Domain
          </span>
        </div>

        {/* Project Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400">
            No projects found.
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-neon group flex flex-col p-5 transition-all duration-300 hover:scale-[1.02]">
      <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary-500">
        {project.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
        {project.description}
      </p>

      {/* Tags */}
      <div className="mb-4">
        <TagList tags={project.tags} />
      </div>

      {/* Links */}
      <div className="mt-auto flex items-center gap-3 border-t border-slate-200/50 pt-3 dark:border-white/10">
        {project.privateRepo && (
          <span className="flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
            <Lock className="h-3 w-3" />
            <span>Private</span>
          </span>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary-500 dark:text-slate-400"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Code</span>
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary-500 dark:text-slate-400"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Live Demo</span>
          </a>
        )}
        {project.interactive && project.route && (
          <Link
            to={project.route}
            className="flex items-center gap-1.5 text-sm font-medium text-neon transition-colors hover:text-neon/80"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open Interactive</span>
          </Link>
        )}
      </div>
    </article>
  )
}
