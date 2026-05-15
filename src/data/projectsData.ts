export interface Project {
  id: number;
  title: string;
  tags: string[];
  coverImage: string;
  description: string;
  githubUrl: string;
  liveUrl?: string;
}

export const projectsData: Project[] = [
  {
    id: 6,
    title: 'PM Review AI Agent',
    tags: ['Python', 'FastAPI', 'Dify', 'AI Agent', 'Quant', 'Tushare'],
    coverImage: 'https://picsum.photos/seed/pmreview1/300/200',
    description:
      'Automated daily review system built with Dify + FastAPI + Tushare. Pulls A-share industry leader data, calculates excess returns and PM rankings, invokes LLM (Qwen/DeepSeek) for professional review reports, and pushes structured Feishu card messages on a Cron schedule every trading day at 15:30.',
    githubUrl: 'https://github.com/KaniGAO/pm-review-ai-agent',
  },
  {
    id: 1,
    title: 'A-Share Accrual Factor Backtesting Framework',
    tags: ['Python', 'tushare', 'Quant'],
    coverImage: 'https://picsum.photos/seed/quant1/300/200',
    description:
      'Open-source backtesting framework using tushare API for A-share financial data. Monthly rebalancing long/short portfolio (top/bottom 10%). Cumulative return 14.6%, Sharpe 0.91, max drawdown -9.7% from May 2023 to Mar 2026.',
    githubUrl: 'https://github.com/KaniGAO/accrual-factor-backtest',
  },
  {
    id: 2,
    title: 'Alpha Factor Research @ WorldQuant',
    tags: ['Alpha Research', 'Factor', 'Finance'],
    coverImage: 'https://picsum.photos/seed/quant2/300/200',
    description:
      'Independent full-cycle alpha factor research at WorldQuant. Submitted and validated 10+ factor signals covering momentum, reversal, fundamental, and alternative data. Earned IQC Gold Medal.',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'SSE Equity Trading Database & Stat-Arb Models',
    tags: ['Python', 'Database', 'Stat-Arb'],
    coverImage: 'https://picsum.photos/seed/quant3/300/200',
    description:
      'Built scalable database system managing Shanghai Stock Exchange daily equity trading data with REST API integration. Developed correlation/clustering models and mean-reversion strategy backtesting for statistical arbitrage.',
    githubUrl: 'https://github.com/KaniGAO/sse-equity-db',
  },
  {
    id: 4,
    title: 'VaR Model Implementation & Analysis',
    tags: ['Risk', 'Python', 'Monte Carlo'],
    coverImage: 'https://picsum.photos/seed/quant4/300/200',
    description:
      'Complete implementation of Value-at-Risk models: Parametric, Historical Simulation, and Monte Carlo methods. Includes mathematical derivation, Python code examples, and sensitivity analysis visualizations.',
    githubUrl: '#',
  },
  {
    id: 5,
    title: 'Personal Homepage Portfolio',
    tags: ['React', 'TypeScript', 'Vite'],
    coverImage: 'https://picsum.photos/seed/quant5/300/200',
    description:
      'Modern personal homepage built with React + TypeScript + Vite, featuring dark mode, blog system with Markdown rendering, ECharts quant lab dashboard, and project showcase with tag filtering.',
    githubUrl: 'https://github.com/KaniGAO/KaniGAO.github.io',
    liveUrl: 'https://kanigao.github.io/',
  },
  {
    id: 7,
    title: 'Cross-Border AI Analyst (PoC)',
    tags: ['AI Agent', 'Dify', 'FastAPI', 'Feishu', 'Cross-border E-commerce', 'Agentic Workflow'],
    coverImage: 'https://picsum.photos/seed/crossborder1/300/200',
    description:
      'Cross-border e-commerce AI analyst PoC built end-to-end in 8 hours. Powered by Dify workflow orchestration, FastAPI mock API, and Qwen LLM. Features 7 core skills: multi-platform data ingestion (Amazon/TikTok/1688), automated profit & loss calculation, profit attribution analysis, intelligent SKU restocking recommendations, structured morning report generation, anomaly order alerts, and Feishu bot push delivery. Demonstrates the full Agentic Workflow loop from raw data to actionable business intelligence.',
    githubUrl: 'https://github.com/KaniGAO/cross-border-ai-analyst-poc',
  },
  {
    id: 8,
    title: 'Bloomberg Stock Data Pipeline',
    tags: ['Python', 'Bloomberg', 'blpapi', 'Data Analysis', 'Google Colab', 'Finance'],
    coverImage: 'https://picsum.photos/seed/bloomberg1/300/200',
    description:
      'Financial data extraction and analysis pipeline powered by Bloomberg official blpapi API. Built under a constrained school environment (no admin rights, Anaconda Python 3.6). Collects reference data (BDP) for fundamentals like P/E and market cap, historical daily prices (BDH) since 2023, and GICS industry classifications for 5 tech stocks. Syncs CSV outputs to Google Drive for remote analysis on Colab — computing annualized returns, volatility, Sharpe ratio, and generating cumulative return charts, correlation heatmaps, and volatility bar charts as Excel/PDF deliverables.',
    githubUrl: 'https://github.com/KaniGAO/bloomberg_stock_analysis',
  },
]
