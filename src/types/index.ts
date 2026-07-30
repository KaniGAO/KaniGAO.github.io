/** Which site views a project surfaces in. Drives Agent/Tools/Projects/Hero. */
export type ProjectRole = 'project' | 'agent' | 'tool'

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: 'frontend' | 'backend' | 'fullstack' | 'tool'
  githubUrl?: string
  coverImage?: string
  liveUrl?: string
  /** interactive sub-page instead of a plain card */
  interactive?: boolean
  /** route for the interactive sub-page */
  route?: string
  /** which views this work appears in — single source of truth */
  roles?: ProjectRole[]
  /** write-up slug or URL shown on the Agent view (optional) */
  blog?: string
  /** short Chinese role label shown on the Agent view */
  agentRole?: string
  /** status badge shown on the Tools view */
  toolStatus?: 'open-source' | 'local'
  /** lucide icon key for the Tools view */
  toolIcon?: 'file' | 'news' | 'bot' | 'chart'
  /** private GitHub repo — shown with a Private badge, no code link */
  privateRepo?: boolean
}

export interface Skill {
  name: string
  level: number // 0-100
  category: 'language' | 'framework' | 'tool' | 'other'
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content: string
  readingTime: string
}

export interface TimelineItem {
  id: string
  title: string
  subtitle: string
  description: string
  date: string
  type: 'work' | 'education' | 'project' | 'other'
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}
