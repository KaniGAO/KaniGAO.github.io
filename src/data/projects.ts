import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'accrual-factor',
    title: 'Accrual Factor Backtesting Framework',
    description:
      'Open-source A-share factor backtesting framework using tushare. Monthly rebalancing long/short portfolio achieving Sharpe 0.91 and cumulative return 14.6%.',
    tags: ['Python', 'tushare', 'Quant'],
    category: 'fullstack',
    repoUrl: 'https://github.com/KaniGAO/accrual-factor-backtest',
  },
  {
    id: 'alpha-research',
    title: 'WorldQuant Alpha Factor Research',
    description:
      'Independent full-cycle alpha factor research. Validated 10+ factor signals across momentum, reversal, fundamental, and alternative data domains. IQC Gold Medal recipient.',
    tags: ['Alpha', 'Finance', 'Research'],
    category: 'backend',
  },
  {
    id: 'sse-equity-db',
    title: 'SSE Equity Trading Database',
    description:
      'Scalable database system for Shanghai Stock Exchange daily equity data. Includes REST API, stock clustering models, and mean-reversion strategy backtesting.',
    tags: ['Python', 'Database', 'Stat-Arb'],
    category: 'fullstack',
    repoUrl: '#',
  },
  {
    id: 'var-model',
    title: 'VaR Risk Modeling Toolkit',
    description:
      'Value-at-Risk implementation with parametric, historical, and Monte Carlo methods. Features mathematical derivation, Python examples, and tornado chart sensitivity analysis.',
    tags: ['Risk', 'Python', 'Monte Carlo'],
    category: 'tool',
    repoUrl: '#',
  },
  {
    id: 'cross-border-ai-analyst',
    title: 'Cross-Border E-commerce AI Analyst (PoC)',
    description:
      'AI-powered cross-border e-commerce analyst built with Dify workflow + FastAPI + Feishu Bot. Automates multi-platform order analysis, profit attribution, inventory restocking recommendations, and daily report push via LLM (Qwen).',
    tags: ['AI Agent', 'Dify', 'FastAPI', 'Cross-border E-commerce'],
    category: 'fullstack',
    repoUrl: 'https://github.com/KaniGAO/cross-border-ai-analyst-poc',
  },
]
