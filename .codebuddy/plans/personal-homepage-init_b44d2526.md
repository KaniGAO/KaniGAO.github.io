---
name: personal-homepage-init
overview: 使用 React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 搭建个人主页项目，包括项目初始化、目录结构创建、依赖安装、路由配置、主题切换、博客渲染、ECharts 图表、GitHub Actions 部署等完整功能。
design:
  architecture:
    framework: react
  styleKeywords:
    - 现代极简
    - 暗色优先
    - 玻璃拟态
    - 微交互动效
    - 开发者风格
  fontSystem:
    fontFamily: Inter
    heading:
      size: 2.25rem
      weight: 700
    subheading:
      size: 1.5rem
      weight: 600
    body:
      size: 1rem
      weight: 400
  colorSystem:
    primary:
      - "#4F46E5"
      - "#6366F1"
      - "#818CF8"
    background:
      - "#0F172A"
      - "#1E293B"
      - "#FFFFFF"
      - "#F8FAFC"
    text:
      - "#F1F5F9"
      - "#94A3B8"
      - "#0F172A"
      - "#475569"
    functional:
      - "#22C55E"
      - "#EF4444"
      - "#F59E0B"
      - "#3B82F6"
todos:
  - id: vite-init-and-deps
    content: Initialize Vite 5 project with React+TS template and install all dependencies
    status: completed
  - id: config-files-setup
    content: Create Vite config, Tailwind dark mode config, PostCSS, tsconfig paths, globals.css, and .gitignore
    status: completed
    dependencies:
      - vite-init-and-deps
  - id: directory-structure
    content: Create full directory structure with type definitions, constants, and static data files
    status: completed
    dependencies:
      - config-files-setup
  - id: core-layout-and-routing
    content: Build HashRouter with Layout/Header/Footer/ThemeToggle, useTheme hook, and React.lazy page routes
    status: completed
    dependencies:
      - directory-structure
  - id: home-and-projects-pages
    content: Develop Hero page (intro+skills chart) and Projects page (card grid+filter)
    status: completed
    dependencies:
      - core-layout-and-routing
  - id: blog-system
    content: Build blog list (BlogCard+sort+filter), blog detail (react-markdown+highlight), and sample .md post
    status: completed
    dependencies:
      - core-layout-and-routing
  - id: about-page-and-echarts
    content: Create About page (timeline+contact) and reusable EChartsWrapper component with dispose+debounce
    status: completed
    dependencies:
      - core-layout-and-routing
  - id: deployment-and-finalize
    content: Write GitHub Actions deploy.yml, add anti-FOUC script to index.html, add 404 page, polish animations
    status: completed
    dependencies:
      - vite-init-and-deps
---

## 需求概述

基于 React 18 + TypeScript 5 + Vite 5 从零搭建个人主页项目，部署到 GitHub Pages（用户站点 https://kaniGAO.github.io）。

## 核心功能

- **暗色模式系统**：默认暗色主题，用户可切换亮/暗，选择持久化到 localStorage
- **多页面路由**：使用 HashRouter 避免 GitHub Pages 404 问题，包含首页、项目展示、博客、关于等页面
- **项目展示页**：以卡片网格展示个人项目，支持按技术栈筛选
- **博客系统**：基于本地 Markdown 文件 + gray-matter 元数据解析 + react-markdown 渲染 + 代码高亮
- **数据可视化**：使用 ECharts 展示技术栈统计或 GitHub 贡献等数据图表
- **关于页**：个人信息、经历时间线、联系方式
- **GitHub Actions 自动部署**：构建后推送至 main 分支根目录，触发 GitHub Pages 更新
- **响应式设计**：移动端优先，适配桌面端

## 文件规范约束

- 组件文件 PascalCase，页面文件 PascalCase，工具/数据文件 camelCase，常量 UPPER_CASE，博客文件名 YYYY-MM-DD-slug.md
- 目录结构严格按 src/pages/, src/components/, src/data/, src/content/blog/ 组织

## 技术栈

| 层面 | 技术选型 | 说明 |
| --- | --- | --- |
| 构建工具 | Vite 5 | 基于 esbuild 和 Rollup，毫秒级 HMR |
| 框架 | React 18 + TypeScript 5 | StrictMode + 函数组件 + Hooks |
| 样式 | Tailwind CSS 3 | `darkMode: 'class'`，自定义设计令牌 |
| 路由 | react-router-dom 6 | HashRouter，懒加载页面组件 |
| 图表 | ECharts 5 | 封装通用组件，自动销毁 + resize 防抖 |
| 博客 | gray-matter + react-markdown + rehype-highlight + remark-gfm | 本地 .md 解析与渲染 |
| 部署 | GitHub Actions | 构建 dist -> push 到 main 根目录 |


## 实现策略

### 整体架构

采用 **单页应用 (SPA) + HashRouter** 架构，页面组件使用 React.lazy 懒加载。主题系统基于 Tailwind CSS `class` 策略，通过 React Context 实现全局状态管理。

### 数据流

```
[用户交互] -> [React State / Context] -> [组件重渲染] -> [DOM 更新]
                    |
                    v
           [localStorage 持久化]
           (theme 偏好)
```

### 关键设计决策

1. **暗色模式**：Tailwind CSS 的 `darkMode: 'class'` 策略。在 `<html>` 上添加/移除 `dark` class。默认读取 localStorage，无存储则跟随系统 `prefers-color-scheme`。
2. **主题持久化**：自定义 `useTheme` hook，封装 localStorage 读写逻辑，初始加载时注入 class 到 document.documentElement，避免 FOUC（样式闪烁）。
3. **ECharts 封装**：创建 `EChartsWrapper` 组件，`useEffect` 中 init 实例，return cleanup 中 dispose。resize 使用 lodash-es 的 debounce（或自实现 300ms 防抖）。
4. **博客系统**：利用 Vite 的 `import.meta.glob` 静态导入所有 `.md` 文件，构建时打包。gray-matter 解析 frontmatter，react-markdown 配合 rehype-highlight 渲染。
5. **GitHub Pages 部署**：用户站点要求将构建产物推送到 `main` 分支根目录。采用 `peaceiris/actions-gh-pages@v3` 或手动脚本，部署时 force push `dist/` 目录内容到 main。
6. **路由懒加载**：使用 `React.lazy` + `Suspense` 为每个页面组件做代码分割，优化首屏加载。

### 性能与边界处理

- 博客 Markdown 文件通过 `import.meta.glob` 静态导入，打包时集成，无运行时异步加载
- ECharts resize 防抖 300ms，组件卸载时 dispose 实例防止内存泄漏
- 暗色模式添加 `<script>` 内联到 index.html 防止 FOUC
- 404 页面通过 HashRouter 的 `path="*"` 兜底重定向到首页
- 移动端导航菜单使用汉堡按钮 + 抽屉/下拉面板

### 约束

- 不修改 package.json 的 homepage 字段
- 所有内部路由必须使用 HashRouter
- 组件文件、页面文件命名严格遵循 PascalCase

## 架构设计

### 组件层级

```
App (HashRouter)
└── Layout (公共骨架)
    ├── Header
    │   ├── Logo
    │   ├── Nav (路由链接)
    │   └── ThemeToggle
    ├── <Outlet /> (页面内容)
    └── Footer
```

### 路由表

```
/             -> Hero（首页）
/projects     -> Projects（项目展示）
/blog         -> Blog（博客列表）
/blog/:slug   -> BlogPost（博客详情）
/about        -> About（关于）
*             -> Navigate to /
```

### 模块依赖关系

```
组件层               业务层              数据/资源层
Hero ────────────> SITE_CONFIG ────────> src/data/siteConfig.ts
Projects ─────────> projectsData ──────> src/data/projects.ts
Blog ─────────────> blogPosts ─────────> import.meta.glob('./content/blog/*.md')
BlogPost ─────────> grayMatter parse ──> react-markdown render
EChartsWrapper ───> echarts.init/dispose/resize
ThemeToggle ──────> useTheme hook ─────> localStorage + classList
```

## 目录结构

```
KaniGAO.github.io/
├── public/
│   ├── avatar.jpg       # 头像
│   └── favicon.ico      # 站点图标
├── src/
│   ├── components/
│   │   ├── Header.tsx            # [NEW] 顶部导航栏（Logo + Nav + ThemeToggle）
│   │   ├── Footer.tsx            # [NEW] 页脚（版权 + 社交链接）
│   │   ├── Layout.tsx            # [NEW] 整体布局骨架（Header + Outlet + Footer）
│   │   ├── ThemeToggle.tsx       # [NEW] 暗色/亮色切换按钮
│   │   ├── EChartsWrapper.tsx    # [NEW] ECharts 通用封装（init/dispose/resize防抖）
│   │   ├── ProjectCard.tsx       # [NEW] 项目卡片组件
│   │   ├── BlogCard.tsx          # [NEW] 博客文章卡片组件
│   │   └── Tag.tsx               # [NEW] 标签徽章组件（技术栈/分类标签）
│   ├── pages/
│   │   ├── Hero.tsx              # [NEW] 首页：个人简介、头像、标语、技能云、GitHub 统计
│   │   ├── Projects.tsx          # [NEW] 项目展示页：卡片网格 + 筛选
│   │   ├── Blog.tsx              # [NEW] 博客列表页：文章卡片按照日期倒序
│   │   ├── BlogPost.tsx          # [NEW] 博客详情页：Markdown 渲染 + 目录 + 高亮
│   │   ├── About.tsx             # [NEW] 关于页：个人经历时间线 + 联系方式
│   │   └── NotFound.tsx          # [NEW] 404 页面
│   ├── data/
│   │   ├── ROUTES.ts             # [NEW] 路由路径常量
│   │   ├── SITE_CONFIG.ts        # [NEW] 站点配置（个人信息、社交链接、技能列表）
│   │   └── projects.ts           # [NEW] 项目数据（接口定义 + 静态数据）
│   ├── content/
│   │   └── blog/
│   │       └── 2026-05-08-hello-world.md  # [NEW] 示例博客文章
│   ├── hooks/
│   │   ├── useTheme.ts           # [NEW] 主题管理 hook（状态 + localStorage + class切换）
│   │   └── useDebounce.ts        # [NEW] 通用防抖 hook
│   ├── utils/
│   │   └── index.ts              # [NEW] 工具函数（日期格式化、防抖等）
│   ├── types/
│   │   └── index.ts              # [NEW] 全局类型定义（Project, BlogPost, SiteConfig 等接口）
│   ├── styles/
│   │   └── globals.css           # [NEW] 全局样式（Tailwind 指令 + CSS 变量 + 自定义动画）
│   ├── App.tsx                   # [NEW] 路由入口（HashRouter + 路由配置 + Suspense）
│   ├── main.tsx                  # [NEW] 挂载入口（BrowserRouter -> HashRouter）
│   └── vite-env.d.ts            # [NEW] Vite 环境类型声明
├── .github/
│   └── workflows/
│       └── deploy.yml            # [NEW] GitHub Actions 部署脚本
├── index.html                    # [MODIFY] 添加内联脚本防 FOUC，引入字体
├── tailwind.config.js            # [NEW] 暗色模式配置 + 自定义主题
├── postcss.config.js             # [NEW] PostCSS 配置（tailwindcss + autoprefixer）
├── tsconfig.json                 # [MODIFY] 路径别名配置
├── vite.config.ts                # [NEW] Vite 配置
├── package.json                  # [MODIFY] 添加 scripts+依赖（不添加 homepage 字段）
└── .gitignore                    # [MODIFY] 添加忽略规则
```

## 设计体系

### 设计风格

现代极简暗色风格，融合玻璃拟态（glassmorphism）与微交互动效。

- **主题**：默认深色底 + 亮色点缀，亮色模式为浅色底 + 深色文字
- **色彩**：以靛蓝色（indigo）为主色调，搭配青色（cyan）作为强调色，点缀金色（amber/gold）增加精致感
- **布局**：上下结构的单栏布局，内容区居中最大宽度 1200px，留白充足强调呼吸感
- **交互**：hover 时卡片上浮+阴影增强，导航项底部指示线动画，页面切换淡入淡出

### 页面规划（5 页）

#### 1. Hero（首页）

- **Hero 区**：全屏暗色背景，渐变纹理，居中大号名称 + 头衔 + 一句话标语，下方向下滚动指示箭头
- **技能云区**：技术栈标签排列（带图标或颜色标识），使用 ECharts 雷达图/环形图展示技能熟练度
- **GitHub 统计区**：ECharts 展示贡献统计或仓库数据
- **最新动态区**：最近博客文章缩略（2-3 篇）

#### 2. Projects（项目页）

- **筛选栏**：顶部标签按钮组（All, React, TypeScript, Python...），active 高亮
- **卡片网格**：3 列响应式网格，每张卡片包含封面图（或纯色渐变背景）、标题、简短描述、技术栈标签、GitHub/Demo 按钮
- **空状态**：筛选项无结果时显示友好提示

#### 3. Blog（博客列表）

- **文章卡片**：按日期倒序排列，卡片含标题、发布日期、摘要、标签、预计阅读时间
- **标签筛选**：顶部标签云快速筛选
- **分页**：每页 6 篇，带页码或"加载更多"按钮

#### 4. BlogPost（博客详情）

- **文章头部**：标题、发布日期、标签、阅读时间
- **正文区**：Markdown 渲染，代码块带行号和高亮主题（暗色适配），表格样式优化
- **目录导航**（可选）：右侧/TOC 浮窗，根据滚动高亮当前章节
- **底部导航**：上一篇/下一篇链接

#### 5. About（关于页）

- **个人信息卡片**：头像、简介、社交链接图标
- **经历时间线**：垂直时间轴展示学习/工作经历
- **联系方式**：邮箱、GitHub、Twitter/LinkedIn 等链接按钮

### 全局 UI 规范

- **Navigation Bar**：固定顶部，毛玻璃半透明背景（backdrop-blur），Logo + 导航链接 + 主题切换按钮
- **Footer**：深色背景，版权信息 + 社交链接图标
- **按钮**：圆角 8px，hover 时亮度变化/阴影
- **卡片**：圆角 12px，深色模式下深灰背景（bg-gray-800/900），边框使用 border-gray-700，hover 时 border-indigo-500 transition
- **动画**：页面切换 fade-in（0.3s），卡片 hover translateY(-2px) + shadow-lg，导航指示条 transition 0.2s

## Agent Extensions

本次计划使用以下 Agent Extensions：

### Skill

- **多模态内容生成**：生成项目封面图、博客文章的配图、头像 SVG 等视觉资源，丰富页面视觉效果
- **find-skills**：在开发过程中如遇到需要额外能力（如动画库集成、图标系统选择等），可使用该 skill 探索可安装的 agent skills

### SubAgent

- **code-explorer**：在需要批量创建文件或搜索跨目录模式时，使用 code-explorer 子代理高效执行，例如批量生成博客 Markdown 前置元数据模板、批量创建组件骨架代码