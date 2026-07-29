import { Project } from '@/types'

/**
 * Single source of truth for all projects — consumed by both the Home
 * featured list and the /projects page. Tags/categories are the only
 * fields used for filtering; `githubUrl`/`liveUrl`/`route` drive the cards.
 */
export const projects: Project[] = [
  {
    id: 'accrual-factor',
    title: 'A-Share Accrual Factor Backtesting Framework',
    description:
      'Open-source backtesting framework using tushare API for A-share financial data. Monthly rebalancing long/short portfolio (top/bottom 10%). Cumulative return 14.6%, Sharpe 0.91, max drawdown -9.7% from May 2023 to Mar 2026.',
    tags: ['Python', 'tushare', 'Quant'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/accrual-factor-backtest',
  },
  {
    id: 'alpha-research',
    title: 'Alpha Factor Research @ WorldQuant',
    description:
      'Independent full-cycle alpha factor research at WorldQuant. Submitted and validated 10+ factor signals covering momentum, reversal, fundamental, and alternative data. Earned IQC Gold Medal.',
    tags: ['Alpha Research', 'Factor', 'Finance'],
    category: 'backend',
    githubUrl: '#',
  },
  {
    id: 'sse-equity-db',
    title: 'SSE Equity Trading Database & Stat-Arb Models',
    description:
      'Built scalable database system managing Shanghai Stock Exchange daily equity trading data with REST API integration. Developed correlation/clustering models and mean-reversion strategy backtesting for statistical arbitrage.',
    tags: ['Python', 'Database', 'Stat-Arb'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/sse-equity-db',
  },
  {
    id: 'var-model',
    title: 'VaR Model Implementation & Analysis',
    description:
      'Complete implementation of Value-at-Risk models: Parametric, Historical Simulation, and Monte Carlo methods. Includes mathematical derivation, Python code examples, and sensitivity analysis visualizations.',
    tags: ['Risk', 'Python', 'Monte Carlo'],
    category: 'tool',
    githubUrl: '#',
  },
  {
    id: 'cross-border-ai-analyst',
    title: 'Cross-Border AI Analyst (PoC)',
    description:
      'Cross-border e-commerce AI analyst PoC built end-to-end in 8 hours. Powered by Dify workflow orchestration, FastAPI mock API, and Qwen LLM. Features 7 core skills: multi-platform data ingestion (Amazon/TikTok/1688), automated profit & loss calculation, profit attribution analysis, intelligent SKU restocking recommendations, structured morning report generation, anomaly order alerts, and Feishu bot push delivery. Demonstrates the full Agentic Workflow loop from raw data to actionable business intelligence.',
    tags: ['AI Agent', 'Dify', 'FastAPI', 'Feishu', 'Cross-border E-commerce', 'Agentic Workflow'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/cross-border-ai-analyst-poc',
  },
  {
    id: 'bloomberg-stock-analysis',
    title: 'Bloomberg Stock Data Pipeline',
    description:
      'Financial data extraction and analysis pipeline powered by Bloomberg official blpapi API. Built under a constrained school environment (no admin rights, Anaconda Python 3.6). Collects reference data (BDP) for fundamentals like P/E and market cap, historical daily prices (BDH) since 2023, and GICS industry classifications for 5 tech stocks. Syncs CSV outputs to Google Drive for remote analysis on Colab — computing annualized returns, volatility, Sharpe ratio, and generating cumulative return charts, correlation heatmaps, and volatility bar charts as Excel/PDF deliverables.',
    tags: ['Python', 'Bloomberg', 'blpapi', 'Data Analysis', 'Google Colab', 'Finance'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/bloomberg_stock_analysis',
  },
  {
    id: 'alphastream',
    title: 'AlphaStream — HK Multi-Factor Risk & Portfolio Optimizer',
    description:
      'End-to-end quantitative research pipeline for Hong Kong equities: Raw Data → Feature Engineering → Cross-Sectional Factor Regression → Minimum Variance Optimization → Automated Report Delivery. Processes ~440K rows of HK market data through winsorization (2.5%/97.5%) and Z-score normalization, runs daily factor regression (MKT_CAP, P_E_LAGGED, VOLUME) to extract alpha residuals, then solves min w^TΣw via SLSQP under long-only + 30% single-weight cap constraints — achieving 7.27% annualized idiosyncratic volatility. Includes a FastAPI webhook trigger endpoint (POST /trigger) and Gmail SMTP auto-report system that embeds Base64 chart images into Excel attachments for one-click email delivery.',
    tags: ['Python', 'Factor Model', 'Portfolio Optimization', 'Risk Modeling', 'FastAPI', 'HK Stocks', 'Jupyter'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/AlphaStream',
  },
  {
    id: 'bar-model',
    title: 'Bar Model — Factor Covariance Matrix',
    description:
      'Interactive sub-page visualizing the cross-sectional factor covariance matrix. Built with ECharts; swap in your real Bar model analysis. Demonstrates the live, explorable project sub-page pattern.',
    tags: ['Python', 'Quant', 'Interactive', 'ECharts'],
    category: 'tool',
    interactive: true,
    route: '/projects/bar-model',
    githubUrl: '#',
  },
  {
    id: 'pm-review-ai-agent',
    title: 'PM Review AI Agent',
    description:
      'Automated daily review system built with Dify + FastAPI + Tushare. Pulls A-share industry leader data, calculates excess returns and PM rankings, invokes LLM (Qwen/DeepSeek) for professional review reports, and pushes structured Feishu card messages on a Cron schedule every trading day at 15:30.',
    tags: ['Python', 'FastAPI', 'Dify', 'AI Agent', 'Quant', 'Tushare'],
    category: 'fullstack',
    githubUrl: 'https://github.com/KaniGAO/pm-review-ai-agent',
  },
  {
    id: 'personal-homepage',
    title: 'Personal Homepage Portfolio',
    description:
      'Modern personal homepage built with React + TypeScript + Vite, featuring dark mode, blog system with Markdown rendering, ECharts quant lab dashboard, and project showcase with tag filtering.',
    tags: ['React', 'TypeScript', 'Vite'],
    category: 'frontend',
    githubUrl: 'https://github.com/KaniGAO/KaniGAO.github.io',
    liveUrl: 'https://kanigao.github.io/',
  },
]
