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
    tags: ['Python', 'FastAPI', 'AI Agent', 'React', 'Docker', 'rapidfuzz'],
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
    tags: ['Python', 'Factor Model', 'Portfolio Optimization', 'Risk Modeling', 'FastAPI', 'HK Stocks', 'Jupyter'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/AlphaStream',
    roles: ['project'],
  },
  {
    id: 'pm-review-ai-agent',
    title: 'PM Review AI Agent',
    description:
      'Daily A-share review agent (Dify + FastAPI + Tushare): ranks industry leaders by excess return, writes an LLM review, and pushes Feishu cards every trading day at 15:30.',
    tags: ['Python', 'FastAPI', 'Dify', 'AI Agent', 'Quant', 'Tushare'],
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
    tags: ['AI Agent', 'Dify', 'FastAPI', 'Feishu', 'Cross-border E-commerce', 'Agentic Workflow'],
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
    tags: ['Python', 'Bloomberg', 'blpapi', 'Data Analysis', 'Google Colab', 'Finance'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/bloomberg_stock_analysis',
    roles: ['project'],
  },
  {
    id: 'kaniskill',
    title: 'kaniSkill — Personal AI Agent Skill Library',
    description:
      'Private library of custom agent skills and workflows powering my personal AI skill OS — market briefings, report generation and automation routines.',
    tags: ['AI Agent', 'Skills', 'Automation', 'Workflow'],
    category: 'tool',
    roles: ['project'],
    privateRepo: true,
  },
  {
    id: 'personal-homepage',
    title: 'Personal Homepage Portfolio',
    description:
      'This site: immersive WebGL 3D scene (three.js / react-three-fiber) on React + TypeScript + Vite, auto-deployed to GitHub Pages via Actions.',
    tags: ['React', 'TypeScript', 'Vite', 'three.js'],
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
    tags: ['Python', 'Bloomberg ASKB', 'FRED', 'SMTP'],
    category: 'tool',
    roles: ['agent', 'tool'],
    agentRole: '每日市场早报',
    toolStatus: 'local',
    toolIcon: 'news',
  },
]
