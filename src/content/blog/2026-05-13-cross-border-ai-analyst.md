---
title: "从想法到原型:我如何在8小时内搭建一个跨境电商经营分析 AI 员工"
titleEn: "From Idea to Prototype: Building a Cross-border E-commerce Analyst AI Agent in 8 Hours"
tags: ["AI Agent", "Dify", "FastAPI", "Cross-border E-commerce", "Feishu", "Agentic Workflow"]
date: "2026-05-13"
description: "记录从零搭建跨境电商AI分析员工的全过程，包括Dify工作流设计、数据模拟、LLM稳定输出技巧、飞书推送踩坑经验等实战细节。"
descriptionEn: "A full walkthrough of building a cross-border e-commerce analyst AI agent from scratch — Dify workflow design, data simulation, techniques for stable LLM output, and hard-won lessons on Feishu push."
githubUrl: "https://github.com/KaniGAO/cross-border-ai-analyst-poc"
---

# 从想法到原型：我如何在8小时内搭建一个跨境电商经营分析 AI 员工

刚看到题目时，我的第一反应是列一堆高大上的 Skill 名称，比如"多源异构数据融合""智能利润归因引擎"之类的。但写到第四个就写不下去了——这些词听起来唬人，彼此之间毫无逻辑关系，也说不清这个 AI 员工每天到底是怎么工作的。

后来我换了个角度：如果我是老板，每天早上打开手机最想在飞书群里看到什么？一定不是一堆数据，而是三个问题的答案：**昨天赚了多少？哪里亏了？今天该补什么货？**

从需求反推，Skill 不应该是一份功能清单，而应该是一条自动化的工作流。每个 Skill 都是上一环的消费者，又是下一环的生产者，串起来就是 AI 员工完整的工作闭环。这正好对应了 Agentic Workflow 的核心理念——让 AI 像人一样自主完成从数据获取到结论分发的全过程，而不是一步一指令的工具。

基于这个思路，我定下了 7 个核心 Skill：数据获取 → 指标计算 → 盈亏归因 → 库存评估 → 晨报生成 → 补货建议 → 结果包推送，并在 Dify 里用 8 个节点搭出了整个工作流的骨架。

## 第一阶段：基础搭建——看似简单，暗藏玄机

### 让数据更像真的

我用 Python 脚本生成了模拟订单数据，覆盖 Amazon、TikTok Shop、1688 三个平台。第一个坑出现在数据质量上：我一开始生成的数据全是盈利订单，利润表看起来很漂亮但毫无真实感。后来意识到真实业务一定有亏损，于是加入了一批低价促销订单来模拟定价失误的场景，让利润率出现负值。这后来成了异常预警模块里最有说服力的素材——有一条订单利润率低至 -374%，LLM 准确地把它标记为"需紧急排查"。

### Dify 访问本地 API 的诡异问题

GitHub 仓库和本地 API 这部分推进得很顺利，我用 FastAPI 写了一个 `/api/daily_data` 接口，读取 CSV 并按日期过滤返回。但当我把 Dify 工作流的 HTTP Request 节点指向 `http://localhost:8000` 时，请求一直超时。

排查了好一阵才明白过来：Dify 如果是 Docker 部署的，它眼中的 `localhost` 是容器自己，不是宿主机。最后改成宿主机的局域网 IP 地址才顺利调通。这件事给我上了一课：做原型，先把网络通不通这个最底层的问题扫清楚，再谈后面的巧妙设计。

## 第二阶段：Dify 工作流核心——最烧脑的部分

### 数据传递的细节

Dify 的可视化拖拽上手很快，但开始写 Code 节点的逻辑时，问题才真正暴露。HTTP Request 返回的 JSON 结构嵌套很深，Code 节点需要正确提取最内层的 orders 数组。第一次运行时报错说变量未定义，查了半天发现是变量路径写错了——Dify 里的变量引用如果不使用鼠标点选而靠手打，十次有九次会出错。后来我养成习惯，全部用鼠标点选，再也没因为拼写问题卡住。

### 强制净化数据精度

平台利润汇总表里一度出现了 `33.47999999999999` 这种数字。太丑了，而且显得不专业。我在 Code 节点里对所有关键数值做了 `round(x, 2)` 的强制净化。问题不大，但膈应人，最后表格清爽了很多才满意。

### 让 LLM 稳定输出

为了让老板晨报的输出稳定而不是每次花样不同，我设计了很严格的 System Prompt：必须包含总利润、订单数、各平台对比、最低利润订单、总结论。Temperature 也调到了 0.2。但前几次运行时 LLM 还是会偶尔忘记表格格式，补货建议部分有时只给结论不给表格。于是我又调整了 Prompt，明确写死输出格式必须包含 Markdown 表格，列出 SKU、订单数、周转天数、优先级、建议补货量。调整后效果很好，第一次运行就准确指出了亏损最严重的平台，并给出"立即干预定价策略"的建议。

## 第三阶段：飞书推送——最折磨人的坑

**骨架搭好以为就成功了，结果真正的折磨才刚刚开始**

我按照飞书自定义机器人的文档，精心设计了一版 `post` 格式的富文本消息，内含格式化的 Markdown 表格和分段。Dify 工作流运行日志显示 HTTP 节点返回了 200，但飞书群静悄悄的，什么消息都没有。

排查过程很痛苦。我先换用最简单的 `text` 消息类型测试，飞书收到了——说明地址和网络都没问题。再切回 `post` 格式，查看 Dify 的 HTTP Response 原始报文，飞书返回了 `{"code":10002,"msg":"not support markdown tag"}`。原来这个机器人根本不支持 Markdown 标签。

### 一个双引号引发的血案

放弃富文本后，我改用纯文本格式推送。但在 Template 节点里拼好一长段日报，塞进 HTTP 节点的 JSON Body 后，飞书返回了 `{"code":10208,"msg":"text require"}`，意思是没收到有效的文本内容。

我反复检查了消息格式、字段名，都没问题。最后逐字符排查 JSON Body，发现是拼进去的长文本里含有换行符，而整个文本块没有用双引号包裹。JSON 解析器读到第一个换行符就认为字符串结束了，后面的内容全被当成非法 token 丢弃，整个请求体被 parser 直接扔掉了。

加上双引号之后，一切正常。就这么一个字符，折腾了我将近一个小时。

最终的推送格式是纯文本的，我用空格和分隔线模拟了表格。虽然不如富文本美观，但信息完整，数据都对，LLM 的分析也合理。凌晨时分，飞书群里弹出一则长长的日报的那一刻——那种全链路终于跑通的感觉，真的很难形容。

## 那些让我挠头的坑与解法

| 坑 | 解法 |
|----|------|
| 模拟数据全是盈利订单，缺乏真实感 | 加入低价促销订单，制造负利润率案例 |
| Dify 无法访问 localhost API | 改用宿主机局域网 IP 地址 |
| Code 节点变量引用经常拼错 | 全部用鼠标点选变量路径，不再手打 |
| LLM 输出不稳定，偶尔忘记表格 | 强化 Prompt，明确要求输出格式和列名 |
| 飞书 post 格式不支持 Markdown 标签 | 改用 text 格式，用空格和分隔线模拟表格 |
| 长文本没加双引号导致 JSON 解析失败 | 逐字符排查，给文本块加上双引号 |
| 浮点数出现 `33.47999999999999` | Code 节点强制 `round(x, 2)` |

## 如果再来一次，我会

提前用一个最简单的 `text` 消息测试飞书通道，而不是看了文档就照搬 `post` 格式。先证明链路通，再优化内容。

更早导出 Dify 的 DSL 文件，方便版本回滚和备份。工作流改崩了可以一键恢复。

写完 JSON Body 先丢进校验工具跑一遍。一个没加双引号的换行符，不值得花一个小时。

## 写在最后

这个项目从头到尾花了大约 8 个小时。最深的体会是：**AI Native 不只是会调用几个 API，而是能快速定义能力边界、把模糊需求拆解为可执行的 Skill 链条、用低代码工具以最低成本验证可行性，并始终围绕"解决真实问题"来设计一切。**

不是写一份漂亮的文档，是造一个"活"的员工。

<!--lang:en-->

# From Idea to Prototype: Building a Cross-border E-commerce Analyst AI Agent in 8 Hours

My first instinct was a list of fancy Skill names — "multi-source heterogeneous data fusion," "intelligent profit attribution engine," and so on. But by the fourth I was stuck: the words sounded impressive yet had no logical relationship, and explained nothing about what this AI employee actually does each day.

So I flipped the question: if I were the boss, what do I most want in the Feishu group every morning? Not a pile of data, but answers to three questions: **how much did we earn yesterday, where did we lose money, and what should we restock today?**

Working backward from need, a Skill shouldn't be a feature checklist but an automated workflow. Each Skill consumes the previous stage's output and produces the next stage's input — together forming the agent's full loop. That is exactly the core idea of Agentic Workflow: letting AI autonomously run the whole process from data acquisition to conclusion delivery, rather than acting as a one-command-at-a-time tool.

With that, I settled on 7 core Skills: data fetch → metrics → profit/loss attribution → inventory assessment → morning report → restock advice → result push, and built the workflow skeleton with 8 Dify nodes.

## Phase 1: Foundations — Simple Looking, Tricky Beneath

### Making the data feel real

A Python script generated mock orders across Amazon, TikTok Shop, and 1688. The first pitfall was data quality: all-profit orders looked pretty but unreal. Real businesses lose money too, so I added low-price promo orders simulating pricing mistakes, pushing margins negative. That became the most convincing anomaly material — one order at -374% margin was correctly flagged "urgent review needed."

### The weird Dify-local-API problem

The GitHub repo and local API went smoothly; I wrote a FastAPI `/api/daily_data` endpoint reading CSV by date. But pointing Dify's HTTP Request node at `http://localhost:8000` timed out endlessly.

The fix: with Dify on Docker, its `localhost` is the container itself, not the host. Switching to the host's LAN IP worked. Lesson: in a prototype, clear the most basic "is the network even up?" question before any clever design.

## Phase 2: The Dify Core — The Brain-burning Part

### Data-passing details

Dify's drag-and-drop is quick to learn, but the Code node logic exposed real issues. The HTTP response JSON was deeply nested; the Code node had to extract the innermost `orders` array. The first run failed on an undefined variable — a wrong variable path. Hand-typed Dify variable references fail 9 times out of 10; I switched to mouse-picking paths and never got stuck on spelling again.

### Forcing clean precision

Profit summaries once showed `33.47999999999999` — ugly and unprofessional. I forced `round(x, 2)` on all key numbers in the Code node. Minor, but it made the table clean.

### Stabilizing LLM output

For a consistent boss-facing report, I wrote a strict System Prompt (must include total profit, order count, per-platform comparison, lowest-margin order, conclusion) and set Temperature to 0.2. Still, early runs occasionally dropped the table format. I rewrote the Prompt to mandate a Markdown table with explicit columns: SKU, order count, turnaround days, priority, suggested restock. The first run after that correctly flagged the worst-loss platform and advised "intervene on pricing now."

## Phase 3: Feishu Push — The Most Torturous Pit

**I thought the skeleton meant success. The real torture was just beginning.**

Following the Feishu bot docs, I crafted a rich `post` message with formatted Markdown tables. Dify logged HTTP 200, yet the group stayed silent.

Painful debugging: a plain `text` message arrived — so address and network were fine. Switching back to `post` and inspecting the raw HTTP response showed `{"code":10002,"msg":"not support markdown tag"}`. The bot simply doesn't support Markdown tags.

### A tragedy caused by one double quote

Abandoning rich text, I used plain text. But after assembling the report in a Template node and stuffing it into the HTTP node's JSON body, Feishu returned `{"code":10208,"msg":"text require"}`.

Format and field names were fine. Character-by-character inspection of the JSON body revealed the long text contained newlines while the whole block wasn't wrapped in double quotes. The JSON parser ended the string at the first newline, discarding everything after as illegal tokens, and threw away the whole body.

Wrapping it in double quotes fixed everything. One character cost me nearly an hour.

The final push was plain text with spaces and dividers mimicking a table. Less pretty, but complete and correct, with sound LLM analysis. When the long daily report popped into the Feishu group in the small hours, the feeling of the full chain finally working is hard to describe.

## Potholes and Fixes

| Pitfall | Fix |
|----|------|
| Mock data all profitable, unrealistic | Add low-price promo orders with negative margins |
| Dify can't reach localhost API | Use the host's LAN IP |
| Code-node variable refs often mistyped | Always mouse-pick variable paths |
| LLM unstable, sometimes drops table | Stronger Prompt mandating format and columns |
| Feishu `post` rejects Markdown tags | Use `text` format with spaces/dividers |
| Unquoted long text breaks JSON parse | Inspect char-by-char, quote the text block |
| Float `33.47999999999999` | Force `round(x, 2)` in Code node |

## If I did it again

Test the Feishu channel with the simplest `text` message first instead of copying `post` from docs — prove the chain works, then optimize content.

Export the Dify DSL earlier for version rollback and backup.

Validate the JSON body in a linter before sending. One unquoted newline isn't worth an hour.

## In Closing

The project took about 8 hours end to end. The deepest takeaway: **AI Native isn't just calling a few APIs — it's rapidly defining capability boundaries, decomposing vague needs into executable Skill chains, validating feasibility at lowest cost with low-code tools, and designing everything around solving real problems.**

Not writing a pretty document — building a "living" employee.
