import { SocialLink } from '@/types'

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blog' },
  { label: 'Quant Lab', path: '/quant' },
  { label: 'About', path: '/about' },
] as const

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/KaniGAO',
    icon: 'github',
  },
  {
    name: 'Email',
    url: 'mailto:kani@example.com',
    icon: 'mail',
  },
]

export const SITE_CONFIG = {
  title: 'Kani GAO',
  subtitle: 'Quantitative Finance & Risk Management | CUHK Undergraduate',
  description:
    'Turning data into insights and risk into opportunity — Quant sits at the intersection of finance and engineering.',
} as const
