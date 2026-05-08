import { SocialLink } from '@/types'

export const NAV_LINKS = [
  { label: '首页', path: '/' },
  { label: '项目', path: '/projects' },
  { label: '博客', path: '/blog' },
  { label: '关于', path: '/about' },
] as const

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/kaniGAO',
    icon: 'github',
  },
  {
    name: 'Email',
    url: 'mailto:kani@example.com',
    icon: 'mail',
  },
]

export const SITE_CONFIG = {
  title: 'KaniGAO',
  subtitle: '全栈开发者 / 创意构建者',
  description: '热衷于用代码创造优雅的解决方案，探索技术与设计的交汇点。',
} as const
