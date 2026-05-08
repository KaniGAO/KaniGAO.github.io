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
]
