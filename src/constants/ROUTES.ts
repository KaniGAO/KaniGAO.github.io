export const ROUTES = {
  HOME: '/',
  PROJECTS: '/#/projects',
  BLOG: '/#/blog',
  BLOG_POST: (slug: string) => `/#/blog/${slug}`,
  ABOUT: '/#/about',
} as const
