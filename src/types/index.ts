/** Which site views a project surfaces in. Drives Agent/Tools/Projects/Hero. */
export type ProjectRole = 'project' | 'agent' | 'tool'

/** A project tag, classified so the UI can color tech-stack vs domain. */
export interface Tag {
  /** Display text, e.g. "Python" or "Quant". */
  label: string
  /** 'tech' = tech stack/library; 'domain' = field/problem space. */
  kind: 'tech' | 'domain'
}

export interface Project {
  id: string
  title: string
  description: string
  tags: Tag[]
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

export type BlogLang = 'zh' | 'en'

export interface BlogPost {
  slug: string
  title: string
  /** English title, used when the reader switches to EN. */
  titleEn?: string
  date: string
  excerpt: string
  /** English excerpt, used when the reader switches to EN. */
  excerptEn?: string
  tags: string[]
  content: string
  /** Chinese body (before the <!--lang:en--> split marker). */
  contentZh: string
  /** English body (after the <!--lang:en--> split marker). Empty if monolingual. */
  contentEn: string
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
