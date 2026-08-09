---
title: "财报填表 Agent：一次「Word 进 Word 出」的排错全过程"
titleEn: "The Financial-Report-Filling Agent: Debugging a 'Word In, Word Out' Failure End to End"
tags: ["AI Agent", "Python", "FastAPI", "文档自动化", "部署"]
date: "2026-08-04"
description: "记录构建一个把 Excel 三大报表自动填进 Word 模板的财务 Agent：从架构选型、最关键的「Word 进 Word 出」Bug 根因、自适应解析层的设计原则，到用 Render 零运维部署上线全过程。"
descriptionEn: "Building a finance agent that auto-fills Excel financial statements into a Word template — from architecture and the root cause of the critical 'Word in, Word out' bug, to an adaptive parser design and zero-ops deployment on Render."
githubUrl: "https://github.com/KaniGAO/KaniGAO.github.io"
---

# 财报填表 Agent：一次「Word 进 Word 出」的排错全过程

财务从业者写分析报告时，常有一份 **Word 模板**（里面是空的财务表格，首列是项目名、表头是年份），需要把 Excel 里三大报表（资产负债表、利润表、现金流量表）的真实数字**手动抄进 Word**。这是大量重复、易错、耗时的劳动。

这个项目的目标很直接：上传 1 个 Word 模板 + 最多 3 个 Excel 报表 → 系统按「项目名称 + 年份」自动把数字填进 Word → 下载填好的 `.docx`，且**保留原模板样式**。

## 技术选型与架构

做成一个**本地网页应用**（前后端一体）：后端算、前端交互，最终由后端同源托管前端静态文件，一键部署到云平台。

**后端栈：**

| 模块 | 选型 | 作用 |
|------|------|------|
| Web 框架 | FastAPI | 提供 `/api/analyze`、`/api/generate/{session_id}` |
| 文档解析 | python-docx | 读/写 Word 表格 |
| Excel 解析 | openpyxl | 读 Excel 数据 |
| 数据处理 | pandas | 表格规整 |
| 模糊匹配 | rapidfuzz | 项目名相似度比对（`ratio` / `token_sort_ratio`） |
| 数据校验 | pydantic | 接口入参/出参模型 |

**核心处理链路（5 步）：**

```
parse_docx（解析Word）→ parse_excel（解析Excel）→ matcher（模糊匹配 + 同义词/中英映射）
→ filler（生成 fill_plan 回填计划）→ fill_docx（写入Word并导出）
```

**匹配规则（业务能力核心）：**

1. **归一化**：全角转半角、去空白、统一括号、剔除序号（`一、` `(一)`）与噪声（`以-号填列`、`（合并）`）
2. **同义词映射**：`营业总收入→营业收入`、`股东权益合计→所有者权益合计` 等，集中在 `normalize.py` 的 `SYNONYMS`
3. **模糊匹配**：rapidfuzz 双算法取高者，阈值 85
4. **中英互换**：`货币资金 ↔ Cash and Cash Equivalents` 等
5. **保守策略**：项目名与年份**同时**对上才填；未达阈值标记「留空」

前端用 React 18 + Vite + TS + Tailwind，交互流程是「上传 → 展示匹配核对单（哪些填、哪些留空）→ 下载」，还支持中英一键切换。

## 最关键的 Bug：「Word 进 Word 出」

我把用户的「母公司资产负债表」模板传上去，系统处理完下载的 `.docx` **和原文件一模一样**——数字一个都没填进去。

### 根因分析

旧 `docx_parser.parse_docx` 有两个**写死的假设**，而用户真实模板完全打破了它们：

1. **只扫描表格前 3 行找年份表头**。但用户的模板结构是：第 1 行标题 → 第 2 行单位 → 第 3 行元数据（报告期/报表类型）→ **第 4 行才是真正的年份表头**。扫描前 3 行找不到年份，整张表被判定为「无报表」，直接跳过。
2. **死假设「项目名在第 0 列」**。用户模板第 0 列是序号/标题位，名称可能在别处。
3. 旧解析器还把 `报告期`、`报表类型`、`流动资产：` 这类**元数据行/小节标题**误当成财务项目，污染匹配。

结果：`fill_plan` 为空 → `fill_docx` 原样导出 → 「Word 进 Word 出」。

### 修复方案（只动解析层，匹配/回填逻辑零改动）

`docx_parser.parse_docx` 重写：

- 年份表头**扫描整张表**，选「含 4 位年份最多的那一行」作为表头（用户的第 4 行稳赢）
- 支持**单表堆叠多张报表**（按年份表头切分）
- **标签列自动识别**：在年份列左侧/右侧候选列中，选「含文本（非数值）最多」的列当项目名，**兼容「序号+名称」布局**
- 自动**过滤元数据行**和小节标题行

`excel_parser` 加固：只采纳**数值型**单元格，跳过 `一季报/母公司报表` 等非数值文本。

> **解析层要"自适应"，业务层要保持"保守"。** 永远不要对用户输入的文件格式做硬假设（年份在第几行、名称在第几列），而是用启发式扫描；但回填时宁可留空也绝不猜数。元数据白名单和标签列启发式都集中在少数辅助函数里，**遇到新格式加一条规则即可**，不要为每种模板写特例分支。

## 测试与验证策略

用两个脚本（pytest 当时未安装）：

- `tests/test_matcher.py`：匹配引擎单测
- `tests/test_pipeline.py`：端到端（解析→匹配→回填→校验）

针对这次 Bug 专门补了**用户格式**样例 `realistic_template.docx`（年份行在第 4 行 + 报告期元数据行 + 小节标题行）+ 同名 Excel。测试断言覆盖：识别出 1 张表、过滤掉 `报告期/报表类型/流动资产：`、全部匹配、回填数值正确（货币资金 2026=44.28 / 2025=10.60 / 2024=23.48 / 2023=18.90）。

**结果**：原样例无回归（ALL PASS），用户格式样例也 ALL PASS，前端 `npm run build` 通过。

## 部署：选 Render 零运维

| 方案 | 结论 |
|------|------|
| GitHub Pages | ❌ 本项目是含后端的全栈应用 |
| 自建服务器 | ❌ 成本高、要运维 |
| Render / Railway | ✅ 支持 Dockerfile、免费层、推代码自动部署 |

选 Render 的理由：项目已有多阶段 `Dockerfile`（先构建前端、再 Python 跑 uvicorn 同源托管）；有免费层；**push 到 `main` 即自动部署**；支持 `render.yaml` 声明式定义。

新增 `/api/health` 健康检查端点，并把它作为「确认更新已上线」的判据——旧代码返回 404，新代码返回 `{"status":"ok"}`，用 `curl` 一验便知。

免费层有**冷启动**：15 分钟无请求后休眠，下次请求约 30 秒唤醒。

## 让工具「开箱即用」

为了让工具立刻能演示，从公开财经网站抓取了**贵州茅台（600519）2022-2024 三年真实三张报表**存为 Excel；模板下载站需要登录，于是**程序化生成一份专业级财务分析报告模板**（`封面 → 目录 → 三张报表空表`），年份列格式与 Excel 一一对应。与其和登录墙搏斗，不如用代码生成一份格式契合的模板，反而更可控。

## 经验总结

1. **解析用户输入文件，永远用"扫描+启发式"，不用"硬假设位置"**。这是本项目最大的坑，也是最重要的设计原则。
2. **业务匹配保持保守**：填不上的留空，绝不猜数——这是财务工具的生命线。
3. **Bug 修复要"只动最小必要层"**：这次只改 `docx_parser`/`excel_parser`，匹配/回填/字典全没动，风险可控。
4. **为新格式补真实样例 + 断言**，比"我觉得改对了"可靠得多。
5. **部署判据要可量化**：用 `/api/health` 从 404 到 ok 的变化，客观证明"更新已上线"。
6. **免费托管选 Render**：Dockerfile 项目 push 即部署，零运维，适合个人工具；冷启动是唯一的体验代价。

线上地址：https://fin-report-agent.onrender.com/

*（本记录为项目全程的经验沉淀，供后续迭代、复现、或写技术博客使用。）*

<!--lang:en-->

# The Financial-Report-Filling Agent: Debugging a 'Word In, Word Out' Failure End to End

Finance analysts writing reports often start from a **Word template** — empty financial tables where the first column is the line-item name and the header is the year — and must **manually copy** the real numbers from Excel's three statements (balance sheet, income statement, cash-flow statement) into Word. Repetitive, error-prone, time-consuming.

The goal is simple: upload 1 Word template + up to 3 Excel statements → the system auto-fills numbers by "line-item name + year" → download the filled `.docx`, **preserving the original template styling**.

## Stack & Architecture

A **local web app** (full-stack): backend computes, frontend interacts, and the backend ultimately serves the frontend's static files from the same origin for one-click cloud deploy.

**Backend:**

| Module | Choice | Role |
|------|------|------|
| Web framework | FastAPI | `/api/analyze`, `/api/generate/{session_id}` |
| Doc parsing | python-docx | read/write Word tables |
| Excel parsing | openpyxl | read Excel data |
| Data handling | pandas | table wrangling |
| Fuzzy matching | rapidfuzz | line-item similarity (`ratio` / `token_sort_ratio`) |
| Validation | pydantic | request/response models |

**Core pipeline (5 steps):**

```
parse_docx → parse_excel → matcher (fuzzy + synonym/zh-en map)
→ filler (build fill_plan) → fill_docx (write & export)
```

**Matching rules (the core capability):**

1. **Normalize**: full-to-half width, trim, unify brackets, strip numbering (`一、` `(一)`) and noise (`以-号填列`, `（合并）`)
2. **Synonyms**: `营业总收入→营业收入`, `股东权益合计→所有者权益合计`, centralized in `normalize.py`'s `SYNONYMS`
3. **Fuzzy match**: rapidfuzz best-of-two algorithms, threshold 85
4. **Zh/En swap**: `货币资金 ↔ Cash and Cash Equivalents`, etc.
5. **Conservative**: fill only when **both** name and year match; below threshold → mark "leave blank"

Frontend: React 18 + Vite + TS + Tailwind — upload → show a match checklist (what fills, what stays blank) → download, with a zh/en toggle.

## The Critical Bug: "Word In, Word Out"

I uploaded the user's "parent-company balance sheet" template. The downloaded `.docx` was **identical to the original** — not a single number filled in.

### Root Cause

The old `docx_parser.parse_docx` made two **hardcoded assumptions** the real template broke:

1. **It only scanned the first 3 rows for the year header.** But the template is: row 1 title → row 2 unit → row 3 metadata (report period / statement type) → **row 4 is the real year header**. Scanning 3 rows found no year, so the table was judged "no statement" and skipped.
2. **It assumed the name is in column 0.** The user's column 0 is an index/title slot; the name can be elsewhere.
3. It also mistook metadata rows / section titles like `报告期`, `报表类型`, `流动资产：` for financial items, polluting the match.

Result: empty `fill_plan` → `fill_docx` exported as-is → "Word in, Word out."

### Fix (only the parser changed; matching/filling untouched)

Rewrote `docx_parser.parse_docx`:

- Scan the **whole table** for the year header, picking the row with the most 4-digit years (row 4 wins).
- Support **multiple stacked statements** in one table (split by year headers).
- **Auto-detect the label column**: among candidate columns left/right of the year columns, pick the one with the most text (non-numeric) cells — **tolerant of "index + name" layouts**.
- Auto-**filter metadata rows** and section-title rows.

Hardened `excel_parser`: accept only **numeric** cells; skip non-numeric text like `一季报/母公司报表`.

> **The parser must be adaptive; the business layer must stay conservative.** Never hardcode file-format positions (which row holds the year, which column holds the name) — use heuristics. But when filling, prefer leaving blanks over guessing. Keep metadata whitelists and label-column heuristics in a few helper functions so **new formats need one new rule, not a special branch per template**.

## Testing & Validation

Two scripts (pytest wasn't installed then):

- `tests/test_matcher.py`: matcher unit tests
- `tests/test_pipeline.py`: end-to-end (parse → match → fill → verify)

For this bug I added a **real-user-format** fixture `realistic_template.docx` (year row at line 4 + report-period metadata + section titles) with a matching Excel. Assertions: 1 table recognized, `报告期/报表类型/流动资产：` filtered, all matched, correct fills (货币资金 2026=44.28 / 2025=10.60 / 2024=23.48 / 2023=18.90).

**Result**: no regression on the original fixture (ALL PASS), the user-format fixture also ALL PASS, and `npm run build` passed.

## Deployment: Render for Zero Ops

| Option | Verdict |
|------|------|
| GitHub Pages | ❌ this is a full-stack app with a backend |
| Self-hosted server | ❌ cost + ops burden |
| Render / Railway | ✅ Dockerfile support, free tier, push-to-deploy |

Why Render: the project already had a multi-stage `Dockerfile` (build frontend, then run uvicorn serving both); free tier; **push to `main` deploys**; `render.yaml` declarative config.

Added an `/api/health` endpoint as the "is the update live?" criterion — old code returned 404, new code returns `{"status":"ok"}`, verifiable with `curl`.

The free tier has **cold starts**: sleeps after 15 idle minutes; ~30s wake-up on the next request.

## Making It Work Out of the Box

To demo immediately, I scraped **Kweichow Moutai (600519) real three statements for 2022–2024** into Excel. The template download site needed login, so I **programmatically generated a professional financial-analysis report template** (cover → TOC → three empty statement tables) with year columns matching the Excel exactly. Rather than fight a login wall, generate a format-fitting template — more controllable.

## Lessons

1. **Parse user files with scanning + heuristics, never hardcoded positions.** The biggest pitfall, and the key design principle.
2. **Stay conservative in matching**: leave blanks rather than guess — the lifeline of a finance tool.
3. **Fix the minimal necessary layer**: only `docx_parser`/`excel_parser` changed; matching/filling/dictionary untouched — low risk.
4. **Add real fixtures + assertions for new formats** — far more reliable than "I think it's fixed."
5. **Quantify the deploy criterion**: `/api/health` going 404→ok objectively proves "update is live."
6. **Free hosting → Render**: Dockerfile projects deploy on push, zero ops, great for personal tools; cold start is the only cost.

Live: https://fin-report-agent.onrender.com/

*(This record is the project's accumulated experience, for later iteration, reproduction, or a tech blog.)*
