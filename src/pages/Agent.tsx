import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { ExternalLink, BookOpen } from 'lucide-react'
import { projects } from '@/data/projects'
import TagList from '@/components/TagList'

/**
 * Real, shipped AI-agent work only. Derived from the single `projects`
 * source — every entry with `roles` including 'agent' renders here, so the
 * cards can never drift from the project/tool views. Each links to its
 * GitHub repo, a write-up on this site (if any), and its live demo (if any).
 */
export default function Agent() {
  const agents = projects.filter((p) => p.roles?.includes('agent'))

  return (
    <div className="py-16">
      <div className="container-custom max-w-4xl">
        <PageHeader
          eyebrow="AI Agents"
          title="Agents I've Shipped"
          subtitle="Real, working AI-agent systems — each one links to its public repo or write-up."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="card-base flex flex-col p-6 transition-all hover:border-primary-500/50"
            >
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold">{agent.title}</h3>
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary-500">
                {agent.agentRole}
              </p>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {agent.description}
              </p>
              <div className="mb-4">
                <TagList tags={agent.tags} variant="pill" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {agent.githubUrl && (
                  <a
                    href={agent.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-400"
                  >
                    <ExternalLink className="h-4 w-4" /> GitHub
                  </a>
                )}
                {agent.liveUrl && (
                  <a
                    href={agent.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-400"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                )}
                {agent.blog && (
                  <Link
                    to={agent.blog}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-400"
                  >
                    <BookOpen className="h-4 w-4" /> Write-up
                  </Link>
                )}
                {!agent.githubUrl && !agent.liveUrl && !agent.blog && (
                  <span className="text-sm text-slate-400">
                    Personal automation — runs locally daily
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
