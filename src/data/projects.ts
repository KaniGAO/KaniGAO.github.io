import { Project } from '@/types'

/**
 * Single source of truth for ALL work on this site. Each project declares
 * the views it appears in via `roles`, and the Agent / Tools / Projects /
 * Home views derive their content from this one array — so a description is
 * written once and can never drift between pages.
 *
 *   - Home featured + /projects  → roles includes 'project'
 *   - /agent                     → roles includes 'agent'
 *   - /tools                     → roles includes 'tool'
 *
 * Policy: only verified work is listed. Descriptions are ONE-LINE
 * positioning statements — full details live in the linked repo.
 * `privateRepo: true` renders a Private badge instead of a code link.
 */
export const projects: Project[] = [
  {
    id: 'fin-report-agent',
    title: 'Fin-Report Agent — Financial Statement Auto-Filler',
    description:
      'AI agent that fills financial figures from Excel statements back into Word report templates — fuzzy-matching engine that never guesses numbers, fully local, live on the web.',
    tags: [
      { label: 'AI Agent', kind: 'domain' },
      { label: 'Document Automation', kind: 'domain' },
      { label: 'rapidfuzz', kind: 'tech' },
    ],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/fin-report-agent',
    liveUrl: 'https://fin-report-agent.onrender.com/',
    roles: ['project', 'agent', 'tool'],
    agentRole: '财报填表自动化',
    toolStatus: 'open-source',
    toolIcon: 'file',
  },
  {
    id: 'alphastream',
    title: 'AlphaStream — HK Multi-Factor Risk & Portfolio Optimizer',
    description:
      'End-to-end quant pipeline for HK equities: factor regression → minimum-variance optimization (7.27% annualized idio vol) → automated email report delivery.',
    tags: [
      { label: 'Factor Model', kind: 'domain' },
      { label: 'Portfolio Optimization', kind: 'domain' },
      { label: 'Risk Modeling', kind: 'domain' },
    ],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/AlphaStream',
    roles: ['project'],
  },
  {
    id: 'pm-review-ai-agent',
    title: 'PM Review AI Agent',
    description:
      'Daily A-share review agent (Dify + FastAPI + Tushare): ranks industry leaders by excess return, writes an LLM review, and pushes Feishu cards every trading day at 15:30.',
    tags: [
      { label: 'Quant', kind: 'domain' },
      { label: 'LLM Review', kind: 'domain' },
      { label: 'Dify', kind: 'tech' },
    ],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/pm-review-ai-agent',
    roles: ['project', 'agent'],
    blog: '/blog/codebuddy-investment-review-agent',
    agentRole: 'A 股每日复盘',
  },
  {
    id: 'cross-border-ai-analyst',
    title: 'Cross-Border AI Analyst (PoC)',
    description:
      'Cross-border e-commerce AI analyst PoC built in 8 hours: 7 skills from multi-platform data ingestion to P&L attribution, restocking advice and Feishu morning reports.',
    tags: [
      { label: 'E-commerce Analytics', kind: 'domain' },
      { label: 'Agentic Workflow', kind: 'domain' },
    ],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/cross-border-ai-analyst-poc',
    roles: ['project', 'agent'],
    blog: '/blog/cross-border-ai-analyst',
    agentRole: '跨境电商经营分析',
  },
  {
    id: 'bloomberg-stock-analysis',
    title: 'Bloomberg Stock Data Pipeline',
    description:
      'Bloomberg blpapi data pipeline built in a locked-down school lab: BDP/BDH extraction to Google Drive, with returns, Sharpe and correlation analysis on Colab.',
    tags: [
      { label: 'Bloomberg', kind: 'tech' },
      { label: 'Data Analysis', kind: 'domain' },
    ],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/bloomberg_stock_analysis',
    roles: ['project'],
  },
  {
    id: 'kaniskill',
    title: 'kaniSkill — Personal AI Agent Skill Library',
    description:
      'Private library of custom agent skills and workflows powering my personal AI skill OS — market briefings, report generation and automation routines.',
    tags: [
      { label: 'AI Agent', kind: 'domain' },
      { label: 'Automation', kind: 'domain' },
      { label: 'Skills', kind: 'domain' },
    ],
    category: 'tool',
    roles: ['project'],
    privateRepo: true,
  },
  {
    id: 'personal-homepage',
    title: 'Personal Homepage Portfolio',
    description:
      'This site: immersive WebGL 3D scene (three.js / react-three-fiber) on React + TypeScript + Vite, auto-deployed to GitHub Pages via Actions.',
    tags: [
      { label: 'WebGL', kind: 'tech' },
      { label: 'React', kind: 'tech' },
    ],
    category: 'frontend',
    githubUrl: 'https://github.com/KaniGAO/KaniGAO.github.io',
    liveUrl: 'https://kanigao.github.io/',
    roles: ['project'],
  },
  {
    id: 'global-markets-briefing',
    title: 'Global Markets Briefing Agent',
    description:
      'Daily local agent that ingests Bloomberg ASKB output, cross-checks it against Yahoo Finance / FRED, then generates and emails a structured DOCX morning briefing.',
    tags: [
      { label: 'Bloomberg ASKB', kind: 'tech' },
      { label: 'Financial Reporting', kind: 'domain' },
    ],
    category: 'tool',
    roles: ['agent', 'tool'],
    agentRole: '每日市场早报',
    toolStatus: 'local',
    toolIcon: 'news',
  },
  {
    id: 'foodpanda-menu-to-excel',
    title: 'foodpanda Menu → Excel',
    description:
      'Paste any foodpanda restaurant link, dynamically pick the columns you want, and one-click download the menu as an Excel price sheet — live web tool, no login or cookie needed.',
    tags: [
      { label: 'FastAPI', kind: 'tech' },
      { label: 'React', kind: 'tech' },
      { label: 'Web Scraping', kind: 'domain' },
    ],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/foodpanda-menu-to-excel',
    liveUrl: 'https://foodpanda-menu-to-excel.onrender.com',
    roles: ['tool'],
    toolStatus: 'open-source',
    toolIcon: 'file',
  },
]
