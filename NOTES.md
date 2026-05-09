# 项目暂停备忘录
> 存档日期：2026-05-09
> 预计恢复：2026-05-16

## 🔗 核心链接
- 线上地址：https://kanigao.github.io
- 仓库地址：https://github.com/KaniGAO/KaniGAO.github.io
- Actions 部署状态：https://github.com/KaniGAO/KaniGAO.github.io/actions

## ✅ 已完成
- React + TypeScript + Vite 项目搭建
- Tailwind CSS 暗色模式
- 个人简历数据全英文填入（src/data/）
- 首页Hero、技能雷达、项目卡片、实习时间轴、竞赛卡片、辩论队经历
- **路由策略：HashRouter**（已在 App.tsx 中使用，避免 GitHub Pages 子路由 404）
- GitHub Actions 自动部署（deploy.yml）
- 添加 `public/.nojekyll` 阻止 Jekyll 处理（PR: fix/hashrouter-gh-pages 待合并）
- **⚠️ Source 需手动改为 GitHub Actions**：Settings → Pages → Source → 选 "GitHub Actions"

## 🐛 已知问题
- 页面底部有残留的演示内容（中文VaR文章、React技巧、useLocalStorage示例）待删除
- 线上白屏问题根因已定位：Pages 部署源仍为 "Deploy from a branch"（直接提供源码），需改用 GitHub Actions 才能部署构建产物

## 📋 下周待办
- [ ] 合并 PR `fix/hashrouter-gh-pages` 到 main
- [ ] **在 GitHub Settings → Pages → Source 中改为 "GitHub Actions"**
- [ ] 删除残留演示内容
- [ ] 核对所有简历信息是否与最新PDF一致
- [ ] 优化移动端响应式布局
- [ ] 考虑加入交互式量化图表（ECharts回测曲线）
- [ ] 添加 Contact / LinkedIn 联系方式

## 💬 关键CodeBuddy指令存档
### 更新简历英文版
（把当时那整段英文简历指令复制在这里）

### 修改 Oakcean 为 Summer Research Program
（把当时的指令复制在这里）

### 清理残留内容
"检查我页面底部的中文VaR文章、React开发技巧和useLocalStorage示例代码，把它们从对应组件中全部删除，只保留我简历里的真实内容。"

### 修复白屏问题（已完成诊断）
项目已使用 HashRouter，白屏真正原因是 GitHub Pages 部署源配置错误（直接部署源码而非构建产物）。修复步骤：
1. 添加 `.nojekyll` 到 `public/`（已完成并提交到 fix/hashrouter-gh-pages 分支）
2. 用户需在仓库 Settings → Pages → Source 改为 "GitHub Actions"
3. 合并 PR 后重新触发部署即可生效

## 🔑 技术备忘
- **路由：HashRouter**（react-router-dom，App.tsx 中已配置，非 BrowserRouter）
- **部署方式：GitHub Actions (deploy.yml) → gh-pages 分支**
- **本地启动：npm run dev**
- **构建命令：npm run build**
- **构建产物输出：dist/**
- **关键文件：**
  - `src/App.tsx` — 主入口，包含 HashRouter + 路由配置
  - `src/constants/ROUTES.ts` — 路由路径常量
  - `.github/workflows/deploy.yml` — CI/CD 部署工作流
  - `public/.nojekyll` — Jekyll 禁用文件（必须保留）
