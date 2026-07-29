export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: 'frontend' | 'backend' | 'fullstack' | 'tool'
  githubUrl?: string
  coverImage?: string
  liveUrl?: string
  /** interactive sub-page (e.g. /projects/bar-model) instead of a plain card */
  interactive?: boolean
  /** route for the interactive sub-page */
  route?: string
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
