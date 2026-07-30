import PageHeader from '@/components/PageHeader'
import { FileSpreadsheet, Newspaper, ExternalLink } from 'lucide-react'
import { projects } from '@/data/projects'
import { Project } from '@/types'

/**
 * Real tools and automations I built and use. Derived from the single
 * `projects` source — every entry with `roles` including 'tool' renders
 * here. Links point to the live demo when one exists, otherwise the repo.
 */
const ICONS: Record<string, typeof FileSpreadsheet> = {
  file: FileSpreadsheet,
  news: Newspaper,
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  'open-source': {
    label: 'Open Source',
    className: 'bg-green-500/10 text-green-500',
  },
  local: {
    label: 'Local Automation',
    className: 'bg-sky-500/10 text-sky-500',
  },
}

export default function Tools() {
  const tools = projects.filter((p) => p.roles?.includes('tool'))

  return (
    <div className="py-16">
      <div className="container-custom">
        <PageHeader
          eyebrow="Toolkit"
          title="Tools"
          subtitle="Real tools and automations I built and use — nothing listed here is a mock-up."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool: Project) => {
            const Icon = ICONS[tool.toolIcon ?? 'file'] ?? FileSpreadsheet
            const status = tool.toolStatus ? STATUS_STYLES[tool.toolStatus] : null
            return (
              <div
                key={tool.id}
                className="card-base group flex flex-col p-6 transition-all hover:border-primary-500/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  {status && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{tool.title}</h3>
                <p className="mb-4 flex-1 text-sm text-slate-600 dark:text-slate-400">
                  {tool.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-slate-200/50 pt-3 dark:border-white/10">
                  {tool.liveUrl && (
                    <a
                      href={tool.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-400"
                    >
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                  )}
                  {tool.githubUrl && (
                    <a
                      href={tool.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-400"
                    >
                      <ExternalLink className="h-4 w-4" /> GitHub
                    </a>
                  )}
                  {!tool.liveUrl && !tool.githubUrl && (
                    <span className="text-sm text-slate-400">
                      Runs locally on a daily schedule
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
