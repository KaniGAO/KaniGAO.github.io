---
title: "如何用 CodeBuddy 两天从 0 到 1 搭一个投资复盘 Agent"
titleEn: "Building an Investment Review Agent from 0 to 1 in Two Days with CodeBuddy"
tags: ["AI Agent", "Dify", "FastAPI", "CodeBuddy", "Tushare", "Feishu", "Quant"]
date: "2026-05-10"
description: "记录用 CodeBuddy 作为 AI 编程搭档，两天内完成投资复盘 AI Agent 的全流程：从需求拆解、FastAPI 数据服务、Dify 工作流编排到飞书自动推送，包含 12 个任务的实战踩坑经验。"
descriptionEn: "How I used CodeBuddy as an AI coding partner to ship an investment-review agent in two days — from scoping and a FastAPI data service to a Dify workflow and Feishu push, with 12 hands-on tasks and hard-won lessons."
githubUrl: "https://github.com/KaniGAO/pm-review-ai-agent"
---

# 如何用 CodeBuddy 两天从 0 到 1 搭一个投资复盘 Agent

## 一、需求破译：把模糊目标翻译成可落地的 MVP

在金融圈，很多分析师每天收盘后都要重复一套繁琐动作：从终端导出数据、粘贴到 Excel、再手工统计 PM（Portfolio Manager，基金经理）的当日收益和龙头匹配情况，最后挤出一段复盘文字。这个过程耗时耗力，而且容易出错。

我瞄准的就是这个痛点。要做一个 AI Agent，它需要完成以下工作：

- 每日收盘后，自动获取全市场按行业划分的龙头股表现；
- 结合几位 PM 的持仓，计算各自的收益、超额收益、龙头暴露度；
- 由大模型生成一段 200-300 字的专业复盘点评；
- 将图文报告准时推送到飞书群。

即使手上没有公司的 Wind 账号、没有真实 PM 数据，也完全可以先用免费数据源和模拟持仓跑通全流程，验证架构可行性。后期只需更换数据接口，逻辑零改动，就能平滑升级到生产环境。

## 二、架构设计：不做软件，只做编排

很多人听到"AI Agent"就想到要开发一个带界面的软件，实际上最轻量的方式是**让 AI 直接编排已有能力**。整体设计分为四层：

```
┌───────────────────────────────────┐
│          触达层                    │
│   飞书/企微机器人 | Dify 对话界面  │
└──────────────┬────────────────────┘
               │ Webhook
┌──────────────▼────────────────────┐
│         AI 编排层 (Dify)           │
│  Workflow / Code节点 / LLM节点    │
└──────────────┬────────────────────┘
               │ HTTP (内网 API)
┌──────────────▼────────────────────┐
│        数据服务层 (FastAPI)        │
│  /leaders /pm /market 接口        │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│          数据源层                  │
│  Tushare(演示) / Wind(生产) /模拟  │
└───────────────────────────────────┘
```

所有敏感数据只在本地流转。演示阶段用 Tushare 免费行情和虚拟 PM 持仓，生产环境只需把数据接口换成 Wind 和内部数据库，其余节点保持不变。

## 三、技术选型

- **Dify**：本地部署，提供 Chatflow 编排、Code 节点、LLM 节点、定时触发，无需前端开发。
- **FastAPI**：作为数据服务中间层，封装行情、持仓、指数接口，并加上 Token 认证。
- **Tushare Pro**：免费注册即可获取 A 股日线、行业分类、资金流向，非常适合 Demo。
- **DeepSeek**：作为 LLM 节点模型，生成点评文本质量稳定，且演示阶段使用的是模拟数据，无合规风险。
- **飞书自定义机器人**：通过 Webhook 推送卡片消息，支持 Markdown，零成本。
- **CodeBuddy**：全程的 AI 编程助手，帮我写代码骨架、定位报错、设计提示词和文档。

## 四、两天开发实录：12 个任务逐项拆解

我把整个项目拆成了 12 个"最小可执行任务"，CodeBuddy 是每个任务的分步指南。

### 第一天：搭骨架，跑数据

**任务 1：项目初始化与 Dify 本地部署**
用 Docker Compose 启动 Dify，确保 `worker_beat` 容器正常运行，为后续定时任务做准备。

**任务 2：FastAPI 数据服务骨架**
创建 `main.py`、`auth.py`、路由文件。CodeBuddy 直接生成 FastAPI 启动模板和 Token 认证中间件，我只需定义接口路径。

**任务 3：生成模拟数据**
因为没有真实 PM 持仓，CodeBuddy 写了一个 `data_simulator.py`，虚拟了 5 位基金经理（PM_Alpha 到 PM_Epsilon），为每人分配不同风格的持仓，并与行业龙头涨跌保持自洽。运行后输出 `leaders_demo.json` 和 `pm_demo.json`。

**任务 4：行业龙头 API**
实现 `GET /api/v1/leaders`。先读取模拟 JSON；随后 CodeBuddy 帮我用 Tushare 写了获取真实申万行业龙头的逻辑——按过去 20 天日均成交额排序取前三。真实股票像盛合晶微、胜宏科技就出现在返回结果里。

**任务 5：PM 持仓与表现 API**
搭建 `/api/v1/pm/positions` 和 `/api/v1/pm/performance`，返回模拟数据。CodeBuddy 确保返回结构与下游 Code 节点计算需求完全一致。

**任务 6：市场指数 API + Token 认证**
增加 `/api/v1/market/index`，返回沪深 300 与中证 500 涨跌幅。同时把 Token 认证中间件全面接入，所有请求必须带 `X-API-Token` 头，安全机制在 Demo 阶段就已就绪。

### 第二天：排名计算、LLM 生成、推送与定时

**任务 7：Dify 第一个 Code 节点——数据获取**
在 Chatflow 画布上，从 Start 节点拖出第一个 Code 节点，用 Python 调用四个 API，把数据整合成 `combined_data`。这里遇到的第一个网络坑：Dify 容器内 `127.0.0.1` 指向容器自身，无法访问宿主机的 FastAPI。CodeBuddy 立刻指出要改成 `host.docker.internal`，问题解决。

**任务 8：第二个 Code 节点——指标计算**
基于 `combined_data` 计算 PM 超额收益排名、龙头 Top5、表现最佳和最弱的两位 PM、简单趋势提示，输出 `analysis_table`。CodeBuddy 帮我写好了完整的数据处理代码。

**任务 9：LLM 节点配置（关键一役）**
我先直接把 `analysis_table`（Object 类型）传入 LLM 节点，结果模型返回"数据未覆盖"。排查后发现 **Dify 的 LLM 节点只接受 String 类型输入**，Object 不会被渲染进提示词里。
解决方案：在 Code 节点与 LLM 节点之间插入一个 **Template 节点**，用 `{{ arg1 }}` 将 Object 转成 JSON 字符串，LLM 再引用 `template.output`。修好后，DeepSeek 给出了完全基于数据的 200-300 字专业点评，数字与源数据一字不差。

**任务 10：报告组装 + 飞书推送**
用一个新 Code 节点，把 `analysis_table` 和 LLM 生成的点评拼成 Markdown 格式，并用 Python 的 `date.today()` 自动填入当天日期。接着新建飞书推送节点，通过 Webhook 发送卡片消息。
这里踩了第二个坑：推送节点一直报 `output result is missing`。CodeBuddy 提醒我检查输出变量——果然是我没有在节点的输出变量面板里定义 `push_result` 字段。补上之后，推送成功。

**任务 11：定时任务配置**
Dify 的定时运行依赖 `worker_beat`。设置 Cron 为 `0 30 7 * * 1-5`（UTC 时间，对应北京时间 15:30）。并修改第一个 Code 节点，自动根据当前日期获取 `trade_date`，周末自动回退到上一个周五。

**任务 12：打包与文档**
编写 README、用 Mermaid 画架构图、截图、导出 Dify 工作流 DSL。CodeBuddy 直接为我生成了 README 模板和 Mermaid 代码，修改几个名称后即可交付。

## 五、CodeBuddy 在过程中扮演了什么角色？

回顾全程，CodeBuddy 远不只是"代码补全"，它更像一个架构师、调试伙伴和文档写手：

- **任务拆解**：每当我卡在"下一步做什么"，它会给出精确到按钮和变量名的步骤。
- **代码生成**：FastAPI 端点、Dify Code 节点逻辑、数据处理，几乎都是它出初稿，我微调。
- **问题定位**：遇到网络配置、变量类型不匹配等问题时，它根据报错迅速给出原因和修改方案。
- **安全提示**：反复强调 `.env` 不提交、Token 脱敏，让我在交付前形成了严格的检查习惯。
- **文档撰写**：README 模板、Mermaid 架构图，甚至这篇复盘文章的大纲，都离不开它的协助。

**人机协作的最佳状态就是：人负责定义"做什么"，AI 负责"怎么做"和"检查漏了什么"。**

## 六、最终效果

- 飞书群每个交易日 15:30 准时收到卡片消息《每日 PM 复盘报告》，内容包括：
  - 市场概况（沪深 300、中证 500 涨跌）
  - 行业龙头 Top5（真实行情数据）
  - PM 收益排名表（超额收益、龙头匹配度、持有龙头）
  - AI 复盘点评（200-300 字，风格专业、克制）
- Dify 对话界面支持追问，比如"PM_Epsilon 为什么今天超额最高？"
- GitHub 仓库包含完整源码、DSL 工作流、README 和截图，其他人按照说明可一键复现。

## 七、Demo 只是起点

这个项目的架构决定了它可以从演示无缝升级到生产：

- 接入 Wind：只改 FastAPI 里的数据获取函数；
- 接入真实 PM 持仓：把模拟 JSON 换成内部数据库查询；
- 完全数据不出网：将 DeepSeek 换成本地部署的模型（如 Ollama + Qwen），彻底杜绝持仓外流。

不需要大团队，不需要半年工期。用 Dify 做编排，用 CodeBuddy 做搭档，两天时间就可以让 AI Agent 真正"上岗"。

<!--lang:en-->

# Building an Investment Review Agent from 0 to 1 in Two Days with CodeBuddy

## 1. Decoding the Requirement: From Vague Goal to a Real MVP

In finance, many analysts repeat a tedious ritual after every close: export data from the terminal, paste it into Excel, manually tally each PM's (Portfolio Manager's) daily P&L and leader-stock exposure, then squeeze out a written review. It is slow, laborious, and error-prone.

That pain point is what I targeted. The AI agent needs to:

- Automatically fetch market-wide leader-stock performance by sector after each close;
- Combine it with several PMs' holdings to compute each PM's return, excess return, and leader exposure;
- Have an LLM generate a 200–300 word professional review;
- Push the report to a Feishu group on schedule.

Even without a company Wind account or real PM data, you can validate the whole pipeline with a free data source and simulated holdings. Later, swapping only the data interface — with zero logic changes — upgrades it smoothly to production.

## 2. Architecture: Orchestrate, Don't Build Software

Many people hear "AI agent" and imagine building a UI app. The lightest approach is actually to **let the AI orchestrate existing capabilities**. The design has four layers:

```
┌───────────────────────────────────┐
│  Touchpoint layer                  │
│  Feishu/WeCom bot | Dify chat UI   │
└──────────────┬────────────────────┘
               │ Webhook
┌──────────────▼────────────────────┐
│  AI orchestration (Dify)           │
│  Workflow / Code node / LLM node   │
└──────────────┬────────────────────┘
               │ HTTP (internal API)
┌──────────────▼────────────────────┐
│  Data service (FastAPI)            │
│  /leaders /pm /market endpoints    │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│  Data source layer                 │
│  Tushare(demo) / Wind(prod) / mock │
└───────────────────────────────────┘
```

All sensitive data stays local. The demo uses free Tushare quotes and virtual PM holdings; production only swaps the data interface to Wind and an internal DB, leaving every other node untouched.

## 3. Tech Stack

- **Dify**: self-hosted, provides Chatflow orchestration, Code/LLM nodes, and scheduled triggers — no frontend needed.
- **FastAPI**: a middleware data service wrapping quotes, holdings, and index endpoints, with token auth.
- **Tushare Pro**: free A-share daily bars, sector classification, and money flow — ideal for a demo.
- **DeepSeek**: the LLM node model; stable review text, and no compliance risk since the demo uses simulated data.
- **Feishu custom bot**: pushes card messages via webhook with Markdown support, at zero cost.
- **CodeBuddy**: the AI coding partner throughout — scaffolding, debugging, prompt design, and docs.

## 4. Two-Day Build Log: 12 Tasks, One by One

I broke the project into 12 minimal executable tasks; CodeBuddy was the step-by-step guide for each.

**Day 1 — scaffold and data**

1. *Project init & Dify local deploy*: Docker Compose up, ensuring `worker_beat` runs for later scheduling.
2. *FastAPI skeleton*: `main.py`, `auth.py`, routers. CodeBuddy generated the bootstrap and token-auth middleware; I only defined routes.
3. *Mock data*: with no real holdings, CodeBuddy wrote `data_simulator.py` virtualizing five PMs (PM_Alpha–PM_Epsilon) with self-consistent styles vs. leader moves, outputting `leaders_demo.json` and `pm_demo.json`.
4. *Leader-stock API*: `GET /api/v1/leaders` first reads mock JSON, then CodeBuddy added real SW industry leaders via Tushare (top 3 by 20-day average turnover) — names like Shenghe Jingwei appeared.
5. *PM holdings & performance APIs*: `/api/v1/pm/positions` and `/api/v1/pm/performance` return mock data shaped exactly for the downstream Code node.
6. *Index API + token auth*: `/api/v1/market/index` returns CSI 300 / CSI 500 moves; token middleware enforced on all routes from the demo stage.

**Day 2 — ranking, LLM, push, scheduling**

7. *First Dify Code node (data fetch)*: the network gotcha — inside the Dify container `127.0.0.1` means the container itself. CodeBuddy immediately said use `host.docker.internal`.
8. *Second Code node (metrics)*: computes excess-return ranking, top-5 leaders, best/worst PMs, and trend hints into `analysis_table`.
9. *LLM node config (the key battle)*: passing `analysis_table` (Object) straight into the LLM node returned "data not covered" — Dify's LLM node only accepts String input. Fix: insert a Template node using `{{ arg1 }}` to serialize the object to JSON, which the LLM references as `template.output`. DeepSeek then produced a 200–300 word data-faithful review.
10. *Report assembly + Feishu push*: a Code node joins `analysis_table` and the review into Markdown with `date.today()`. The push node kept erroring `output result is missing` until CodeBuddy pointed out I'd forgotten to declare the `push_result` output variable.
11. *Scheduling*: Cron `0 30 7 * * 1-5` (UTC = 15:30 Beijing), with the first Code node auto-resolving `trade_date` and falling back to last Friday on weekends.
12. *Packaging & docs*: README, Mermaid architecture diagram, screenshots, exported Dify DSL — CodeBuddy generated the templates.

## 5. What Role Did CodeBuddy Play?

Far beyond "code completion," it acted as architect, debugger, and documentation writer:

- **Task breakdown**: precise steps down to button and variable names.
- **Code generation**: FastAPI endpoints, Dify Code logic, data processing — it drafted, I fine-tuned.
- **Problem localization**: quick root-cause and fixes for network/config and type mismatches.
- **Security reminders**: "don't commit `.env`," token masking — building strict habits before delivery.
- **Docs**: README template, Mermaid diagram, even this retrospective's outline.

**The best human–AI collaboration: humans define *what*, AI handles *how* and *what's missing*.**

## 6. Final Result

- A Feishu card "Daily PM Review Report" lands at 15:30 every trading day: market overview, top-5 sector leaders (real quotes), PM ranking table (excess return, leader match, holdings), and a 200–300 word AI review.
- The Dify chat UI supports follow-ups like "Why did PM_Epsilon have the highest excess return today?"
- The GitHub repo has full source, DSL, README, and screenshots for one-click reproduction.

## 7. The Demo Is Only the Start

The architecture upgrades seamlessly to production: swap the FastAPI fetch function for Wind; replace mock JSON with an internal DB; and for full data isolation, swap DeepSeek for a local model (e.g. Ollama + Qwen). No big team, no six-month timeline — with Dify for orchestration and CodeBuddy as partner, two days put the agent to work.
