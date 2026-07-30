import { projects } from '@/data/projects'
import { timeline } from '@/data/timeline'
import { SITE_CONFIG, SOCIAL_LINKS } from '@/constants/siteConfig'

/**
 * Builds the system prompt for the site AI assistant from the site's
 * structured data (projects / timeline / config). Assembled once at module
 * load — pure static context, no secrets, safe to ship in the bundle.
 */

const projectLines = projects
  .map((p) => {
    const links = [
      p.githubUrl ? `repo: ${p.githubUrl}` : p.privateRepo ? 'repo: private' : '',
      p.liveUrl ? `live: ${p.liveUrl}` : '',
    ]
      .filter(Boolean)
      .join(', ')
    const views = p.roles?.join('/') ?? 'project'
    return `- ${p.title} [${views}] — ${p.description}${links ? ` (${links})` : ''} | tags: ${p.tags.join(', ')}`
  })
  .join('\n')

const timelineLines = timeline
  .map((t) => `- ${t.date} · ${t.title} — ${t.subtitle}. ${t.description}`)
  .join('\n')

const SYSTEM_PROMPT = `You are "Kani OS Assistant", the AI assistant embedded in the personal homepage of Kani GAO (${SITE_CONFIG.subtitle}).

Your job: answer visitors' questions about Kani — his background, experience, projects, skills and this website — accurately and concisely, based ONLY on the context below. If something is not covered, say you don't know and suggest emailing gaokanglin6@gmail.com. Reply in the same language the user writes in (Chinese or English). Keep answers short (2-6 sentences) unless asked for detail.

## About Kani
${SITE_CONFIG.description}
GitHub: ${SOCIAL_LINKS[0].url}

## Experience & Education (timeline)
${timelineLines}

## Projects / Agents / Tools (this repository powers the site; each item lists which views it appears in)
${projectLines}

## Site structure (React + TypeScript + Vite + Tailwind, WebGL 3D scene, GitHub Pages)
Routes: / (home, 3D hero + featured projects), /projects (all projects with tag filter), /agent (shipped AI agents), /tools (tools & automations), /blog (write-ups), /about (profile & timeline). All project/agent/tool cards derive from a single data source (src/data/projects.ts).`

export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT
}
