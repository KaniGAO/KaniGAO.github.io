# 网页内容事实核查报告

> 核查范围：`src/data/projects.ts`、`src/data/timeline.ts`、`src/pages/*`、`src/components/AiAssistant.tsx`、`src/constants/siteConfig.ts`、`src/content/blog/*`、`src/App.tsx` 路由表
> 交叉验证：项目描述 ↔ 时间线 ↔ Quant 页指标 ↔ 博客正文 ↔ 实际路由
> 当前日期基准：2026-07-30

---

## 一、引用错误（死链 / 假数据）— 最影响可信度

### 🔴 1. `/tools/email-briefing` 是死链（点击 404）
- **位置**：`src/pages/Tools.tsx:11`（`to: '/tools/email-briefing'`，且 `status: 'live'`）
- **现状**：Tools 页把 "Global Markets Briefing" 标为 **Live**，提供 "Open →" 链接，但 `src/App.tsx:34-44` 的路由表里**根本没有 `/tools/email-briefing` 这个路由** → 点击跳转到 `*` → 404 NotFound。
- **矛盾点**：你实际已经做出 `bbg-morning-macro-brief` 这类真实早报能力，但网页却指向一个不存在的页面，等于"声称有、点了没有"。
- **建议**：要么补上 `/tools/email-briefing` 真实页面，要么把该项 `status` 改为 `soon` / `to: '#'`。

### 🔴 2. 联系方式邮箱是占位假地址
- **位置**：`src/constants/siteConfig.ts:21`（`url: 'mailto:kani@example.com'`）
- **现状**：`example.com` 是 RFC 2606 明确保留的**示例域名**，不是真实邮箱。About 页的 Email 联系按钮点了会发到空地址。
- **建议**：换成真实邮箱（如 `gaokanglin6@gmail.com`）或指向联系表单。

### 🟠 3. 两个项目的 "Code" 链接是 `'#'` 死链
- **位置**：`src/data/projects.ts:25`（`alpha-research`）、`projects.ts:43`（`var-model`）
- **现状**：卡片 "Code" 链接指向 `'#'`，点击只会跳回页顶、无任何反馈，形同死链。尤其 `var-model` 已有对应博客与 Quant 页，却无仓库链接，显得未完成。
- **建议**：补充真实 repo URL，或把 "Code" 按钮在该类项目上隐藏（判断 `githubUrl !== '#'`）。

---

## 二、项目描述混乱 / 占位文本

### 🔴 4. `bar-model` 是 demo 壳，却被当正式项目展示
- **位置**：`src/data/projects.ts:74-82` 描述 "Interactive sub-page visualizing the cross-sectional factor covariance matrix"；`src/pages/projects/BarModel.tsx:7` 注释 `Placeholder covariance matrix — replace with your real Bar model analysis`；`BarModel.tsx:88` 文案 "Swap the placeholder matrix for your real Bar model analysis"
- **现状**：热力图里的矩阵是用 `Math.random()` 生成的**假数据**（见 `BarModel.tsx:12-13`），代码与文案都自承是占位。但首页 Featured 与 `/projects` 都把它当"真·因子协方差矩阵"展示，属于**把 demo 壳当成果**。
- **建议**：要么注明这是演示模板，要么接入真实 Bar model 数据，要么从正式项目列表移除。

### 🟠 5. 同一项目的时间两处矛盾
- **位置**：
  - `src/data/projects.ts:13`：`accrual-factor` 描述写 "from May 2023 to Mar 2026"（已结束）
  - `src/data/timeline.ts:10`：同项目写 "Mar 2026 – Present"（至今进行中）
- **现状**：同一个 A-share Accrual Factor 项目，projects 说 2023.5–2026.3 结束，timeline 说 2026.3 才开始并至今。时间线自相矛盾。
- **建议**：统一口径（参照 GitHub 仓库真实提交时间）。

### 🟠 6. Quant 页"模拟数据" vs projects 页"真实回测"定性打架
- **位置**：
  - `src/pages/Quant.tsx:212`：标注 "* Metrics are from simulated backtesting sample data, not actual performance."
  - `src/data/projects.ts:13`：`accrual-factor` 直接陈述 "Cumulative return 14.6%, Sharpe 0.91, max drawdown -9.7%"，**无任何"模拟"说明**
- **现状**：两组完全相同的数字，Quant 页说是模拟样本，projects 页当作真实回测结果陈述。读者看到两处会困惑哪个是真的。
- **建议**：projects 描述里也补一句"（样本回测/模拟数据）"，与 Quant 页口径一致。

### 🟡 7. 早期占位博客至今未清理（NOTES 早已点名）
- **位置**：`src/content/blog/2025-01-15-hello-world.md`、`src/content/blog/2025-02-20-react-tips.md`
- **现状**：内容为建站初期的演示残留（useLocalStorage 示例、通用 React 技巧分享、Hello World 入门），与"暗黑沉浸式量化/AI 主页"定位明显不符。`NOTES.md:21` 早在 2026-05-09 就列为"待删除残留演示内容"，至今未删，造成内容噪音。
- **建议**：删除这两篇，或移动到"存档/草稿"分类，避免主页 Blog 流出现违和内容。

---

## 三、agent 能力缺失

### 🔴 8. `/agent` 专区完全空白（占位）
- **位置**：`src/pages/Agent.tsx:20-26`
- **现状**：整页都是 "Coming online" / "Backend setup is Phase 2" / "placeholder for now, UI ready"。**没有任何真实 agent 能力展示**。
- **矛盾点**：你实际已构建并跑通多个可运行 agent——`pm-review-ai-agent`（Dify+FastAPI+Tushare，每日 PM 复盘）、`cross-border-ai-analyst`（Dify+FastAPI+Qwen，跨境电商分析师）、Bloomberg 全球市场早报。这些都是真实成果，但 `/agent` 专区**一个都没体现**，正是你说的"agent 能力缺失"。
- **建议**：把上述真实 agent 项目以卡片/列表形式在 Agent 页呈现（能力说明 + 链接），或至少列出"已完成的能力"。

### 🟠 9. 全局浮动助手也是占位
- **位置**：`src/components/AiAssistant.tsx:73`（`'AI API is under development — auto-replies are not available yet'`）
- **现状**：右下角 "Kani OS 助手" 发消息只会回一句"开发中"。标题叫助手，实则无后端、无真实问答能力。与 Agent 页问题同源。
- **建议**：若短期无真实后端，可在发消息时给出预设 FAQ（已有 `QUICK_QUESTIONS` 框架），或明确标注"演示版"。

---

## 四、次要 / 潜在问题

### 🟡 10. 首页 Featured 硬编码前 3 个，含死链项目
- **位置**：`src/pages/Home.tsx:136`（`projects.slice(0, 3)`）
- **现状**：取前三个 = `accrual-factor` / `alpha-research`(`#` 死链) / `sse-equity-db`。把带 `'#'` 死链的 `alpha-research` 放在首页 Featured 第二位，体验不佳。
- **建议**：用显式 `featured: true` 字段标记真正要展示的项目，而非依赖数组顺序。

### 🟡 11. 残留类型与过时文档
- `src/types/index.ts:16` 定义了 `Skill` 接口（早期"技能雷达"已移除，现无人使用）—— 死类型。
- `NOTES.md:57` 提到 `src/constants/ROUTES.ts`，但该文件已不存在（现用 `siteConfig.NAV_LINKS`）。
- 均非功能错误，属代码/文档噪音。

### 🟡 12. BarModel 子页视觉风格不统一
- **位置**：`src/pages/projects/BarModel.tsx:81` 用硬编码 `indigo-500`，违背主页统一的 neon 红 / primary 设计 token。
- **建议**：改为 `text-primary-500` / `text-neon` 等统一 token。

### 🟡 13. 博客与项目描述的措辞微不一致
- `pm-review-ai-agent` 项目描述写 "invokes LLM (Qwen/DeepSeek)"，但 `2026-05-10` 博客明确**只用 DeepSeek**（未提 Qwen）。
- `cross-border-ai-analyst` 项目描述写 "Qwen LLM"，博客未明确指定模型。
- 属轻微措辞不一致，不影响功能，但追求严谨可统一。

---

## 严重程度汇总

| 等级 | 数量 | 问题 |
|---|---|---|
| 🔴 严重（死链/假数据/空白专区） | 4 | #1 早报死链、#2 假邮箱、#8 agent 空白、#4 demo 壳当成果 |
| 🟠 中等（事实矛盾/占位） | 5 | #3 死链 `#`、#5 时间矛盾、#6 模拟/真实打架、#7 早期博客、#9 助手占位 |
| 🟡 次要 | 4 | #10 Featured 硬编码、#11 残留类型/文档、#12 视觉不统一、#13 措辞微差 |

---

## 建议修复顺序
1. **先修引用错误**（#1 死链、#2 假邮箱、#3 死链 `#`）—— 这些都是"看起来有、点了没有"，最直接损害可信度。
2. **再补 agent 能力**（#8、#9）—— 把已做成的真实 agent 成果在 `/agent` 和浮动助手体现出来。
3. **统一事实口径**（#5 时间、#6 模拟说明、#4 demo 标注）。
4. **清理噪音**（#7 早期博客、#10/#11/#12/#13）。

---

## 五、GitHub 真实仓库对照（2026-07-30 核查）

> 数据来源：GitHub Public API（用户 KaniGAO 的全部公开仓库）+ 逐个 URL 访问验证。

### 你 GitHub 上**真实公开存在**的仓库（共 7 个）
| 仓库名 | 描述 | 语言 | 最近更新 |
|---|---|---|---|
| `fin-report-agent` | 财报填表 Agent：财务报表模板自动填表，中英双语，本地计算，Docker 部署 | Python | **2026-07-29** |
| `KaniGAO.github.io` | 个人主页 | TypeScript | 2026-07-29 |
| `leetcode_learn` | （刷题练习，无描述） | Python | 2026-06-10 |
| `cross-border-ai-analyst-poc` | 跨境电商经营分析 AI 员工（Dify+飞书推送 PoC） | Python | 2026-05-28 |
| `AlphaStream` | （无描述） | Jupyter | 2026-05-21 |
| `bloomberg..."` → `bloomberg_stock_analysis` | Bloomberg Python 数据管道（blpapi） | Jupyter | 2026-05-15 |
| `pm-review-ai-agent` | （无描述） | Python | 2026-05-09 |

### 网页 `projects.ts` ↔ GitHub 真实仓库 对照
| 网页项目 | 声明的 githubUrl | GitHub 实际 |
|---|---|---|
| accrual-factor | `…/accrual-factor-backtest` | 🔴 **404 不存在**（或私有未公开） |
| alpha-research | `#`（占位） | — WorldQuant 实习，无公开 repo 可理解 |
| sse-equity-db | `…/sse-equity-db` | 🔴 **404 不存在**（或私有未公开） |
| var-model | `#`（占位） | — 无 repo |
| cross-border-ai-analyst | `…/cross-border-ai-analyst-poc` | ✅ 存在 |
| bloomberg-stock-analysis | `…/bloomberg_stock_analysis` | ✅ 存在 |
| alphastream | `…/AlphaStream` | ✅ 存在 |
| bar-model | `#`（interactive 子页） | 无 repo，自身 demo 壳 |
| pm-review-ai-agent | `…/pm-review-ai-agent` | ✅ 存在 |
| personal-homepage | `…/KaniGAO.github.io` | ✅ 存在 |

### 新增发现（基于真实仓库核查）
- 🔴 **`accrual-factor` 与 `sse-equity-db` 的 githubUrl 指向 404 死仓库**。注意：这比之前的 `#` 占位**更糟**——网页看起来给了"真实代码链接"，访客一点却是 GitHub 404 页。这两个里，`accrual-factor` 还是首页 Featured **第一位**且带详细回测指标。需确认：这两个仓库你是根本没建 / 已删除 / 还是设为私有未公开？
- 🔴 **`fin-report-agent` 真实存在且最新（2026-07-29 刚更新），但网页 `projects.ts` 完全没列它**。这是个真实、完整的 agent 作品（前后端 + Docker），属于重大遗漏。
- 🟡 **`leetcode_learn` 真实存在但未列**（Python 刷题仓库，通常不值得作为作品展示，可忽略）。

> 注：本轮仅做**诊断核查**，未改动任何代码。确认后告诉我优先修哪些，我再动手。
