import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'personal-homepage',
    title: '个人主页',
    description: '基于 React + TypeScript + Vite 构建的现代个人主页，支持暗色模式、博客系统、项目展示等功能。',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    category: 'fullstack',
    repoUrl: 'https://github.com/kaniGAO/kaniGAO.github.io',
  },
  {
    id: 'task-manager',
    title: '任务管理器',
    description: '功能完整的任务管理应用，支持拖拽排序、分类筛选、数据统计等特性。',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    category: 'fullstack',
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'weather-dashboard',
    title: '天气仪表盘',
    description: '实时天气预报仪表盘，集成多城市切换、趋势图表、天气预警等功能。',
    tags: ['Vue.js', 'ECharts', 'OpenWeather API'],
    category: 'frontend',
    demoUrl: '#',
  },
  {
    id: 'code-snippet-tool',
    title: '代码片段工具',
    description: '开发者代码片段管理与分享工具，支持语法高亮、标签分类、快捷搜索。',
    tags: ['TypeScript', 'React', 'IndexedDB'],
    category: 'tool',
    repoUrl: '#',
  },
]
