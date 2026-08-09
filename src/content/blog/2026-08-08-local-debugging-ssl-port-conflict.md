---
title: "从 SSL 报错到白屏：一次 Full-stack 本地排障复盘"
titleEn: "From SSL Errors to a Blank Screen: A Full-stack Local Debugging Retrospective"
tags: ["调试", "Python", "FastAPI", "Vite", "本地开发"]
date: "2026-08-08"
description: "一次很典型也很有价值的本地排障：表面上连续出现 Python SSL、Node、Xcode 等多个环境问题，但最终前端白屏的真正根因，和最初那几个问题根本不是同一件事——10000 端口被网盘进程 netdisk_s 占用。复盘整套分层验证思路。"
descriptionEn: "A classic, instructive local debugging case: Python SSL, Node, and Xcode errors appeared in sequence, yet the real cause of the blank screen was unrelated to any of them — port 10000 was occupied by a netdisk daemon. A retrospective on layered verification."
githubUrl: "https://github.com/KaniGAO/KaniGAO.github.io"
---

# 从 SSL 报错到白屏：一次 Full-stack 本地排障复盘

这次其实是一个很典型、也很有价值的案例：**表面上连续出现多个环境问题，但最终导致前端白屏的真正根因，和最初几个问题并不是同一个问题。** 如果没有把每一层拆开验证，很容易一直在 Python、Node、Xcode、React 之间反复重装。

> 项目：一个 `Financial Report` 本地 Web 应用，技术栈为 React + TypeScript + Vite 5.4.21 + Node.js（前端）与 FastAPI + Uvicorn + Python 3.12（后端）。

本地开发架构：

```
Browser
  → http://localhost:5173
    → Vite Dev Server
      → /api/* Proxy
        → http://localhost:10000
          → FastAPI / Uvicorn
```

整个排查过程中实际上遇到了 **两个独立问题**：

- **问题 A：Python SSL Certificate 配置损坏**，导致依赖装不上。
- **问题 B：10000 端口被其他程序占用**，导致网页白屏。

---

## 一、第一阶段：Python 依赖装不上

最初运行：

```bash
pip install -r requirements.txt
```

出现：

```
SSLCertVerificationError: certificate verify failed: unable to get local issuer certificate
```

`fastapi`、`uvicorn`、`certifi` 等包全都无法从 PyPI 安装。

随后单独装：

```bash
pip install uvicorn
```

也报 `CERTIFICATE_VERIFY_FAILED`，且 `uvicorn --version` 返回 `command not found`。

**一个关键判断**：`No matching distribution found` 并不代表 PyPI 上没有 FastAPI。真正的错误发生在它之前——`CERTIFICATE_VERIFY_FAILED`。也就是说：

```
pip 无法 HTTPS 访问 PyPI
  → 无法读取 package index
    → pip 看不到任何版本
      → 显示 versions: none
```

所以第一个正确结论是：**Package 本身没问题，SSL certificate verification 才是问题。**

### 验证网络层：curl 正常，Python SSL 异常

```bash
curl -I https://pypi.org
# HTTP/2 200
```

这一步非常关键，它证明 macOS 本身的 DNS / Internet / HTTPS / PyPI 都是通的。

再检查代理环境变量：

```bash
env | grep -i -E "proxy|SSL|REQUESTS|CURL"
# 无输出
```

排除了 `HTTP_PROXY` / `HTTPS_PROXY` / `SSL_CERT_FILE` 等环境变量覆盖问题。

### Python SSL Trust Store 诊断

```bash
python3 -c "import ssl; print(ssl.get_default_verify_paths())"
```

关键输出：`cafile=None, capath=None`，且它期待的 CA 文件路径是：

```
/Library/Frameworks/Python.framework/Versions/3.12/etc/openssl/cert.pem
```

直接检查：

```bash
ls -l /Library/Frameworks/Python.framework/Versions/3.12/etc/openssl/cert.pem
# No such file or directory
```

至此明确：**Python 3.12 期待的 CA certificate bundle 根本不存在。**

### 为什么 Install Certificates.command 也失败？

Python.org 的 macOS installer 自带 `Install Certificates.command`，但运行后仍然失败：

```
-- pip install --upgrade certifi
CERTIFICATE_VERIFY_FAILED
ERROR: No matching distribution found for certifi
-- WARNING: Install Certificates failed
```

看脚本内容就明白了：它本质是先 `pip install certifi`，再 `os.symlink(...)` 把 Python 的 `cert.pem` 指向 `certifi/cacert.pem`。于是陷入典型的 **bootstrap deadlock**：

```
没有证书 → 需要运行 Install Certificates
但 Install Certificates → 又需要 HTTPS 下载 certifi
```

### Python 重装为什么没直接解决？

后来重装了 Python 3.12.10，安装本身成功，但 `Install Certificates.command` 仍然同样的 SSL 错误。这说明：**单纯重装 Python binary 并没有解决 certificate bundle 的 bootstrap 问题。** 看到 certificate error 时，不应该无限重复 reinstall。

### 利用 Anaconda certifi 修复 Python SSL

当时 shell 里同时有 Python venv 和 Conda base：

```bash
conda list certifi
# ca-certificates 2025.7.15
# certifi         2025.8.3
```

虽然当前 venv 中没有 certifi，但 Conda base 里有一份完整的 CA bundle：

```bash
python -c "import certifi; print(certifi.where())"
# /opt/anaconda3/lib/python3.13/site-packages/certifi/cacert.pem
```

建立 symlink：

```bash
sudo ln -sf \
  /opt/anaconda3/lib/python3.13/site-packages/certifi/cacert.pem \
  /Library/Frameworks/Python.framework/Versions/3.12/etc/openssl/cert.pem
```

再验证：

```bash
/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12 - <<'PY'
import urllib.request
print(urllib.request.urlopen("https://pypi.org").status)
PY
# 200
```

**Python SSL trust chain 已恢复。**

> **Debugging 原则**：不要因为"命令没报错"就认为修好了，要设计一个针对 root cause 的验证。这里 root cause 是「Python 无法验证 HTTPS certificate」，所以有效测试不是 `python --version`，而是 `urllib.request.urlopen("https://pypi.org")` 返回 `200`——这属于 **direct root-cause verification**。

随后重新 `pip install -r requirements.txt` 成功。

---

## 二、第二阶段：前端启动但白屏

Python/FastAPI 依赖装好后，进入第二个独立问题。

```bash
npm run dev
# VITE v5.4.21 ready
# Local: http://localhost:5173/
```

也就是说 Node / npm / Vite / React 编译 / Dev server 全 ✅。但浏览器白屏。Console 显示：

```
Failed to load resource: 400 Bad Request (meta)
TypeError: undefined is not an object (evaluating 'meta.units.find')
```

React 随后报告：`<Shell>` component 崩溃。

### 最初对 Node 24 的怀疑

当时 Node 是 `v24.19.0`，而项目此前用 Node 22。怀疑是 Node 24 与 Vite/React 不兼容——这个怀疑本身合理（major upgrade 确实可能影响 ESM/native deps/Vite plugin），但**需要验证，而不是直接认定**。

尝试用 nvm 降级：

```bash
nvm install 22 && nvm use 22
# zsh: command not found: nvm
```

系统没有 nvm。装 nvm 时又卡在：

```
xcode-select: No developer tools were found
Failed to clone nvm repo.
```

因为 nvm installer 依赖 `git`，而 macOS Command Line Tools 没装。

### 为什么 Xcode 缺失不是白屏根因

Xcode / CLT 缺失若真影响前端，错误通常出现在 `npm install` 或 `node-gyp` 编译阶段（`clang: command not found` 等）。但实际上 `VITE ready` 已经证明：

- Node runtime 正常、Vite 正常、JS/TS 编译正常、React bundle 正常、HMR 已连接

真正失败的是应用层 HTTP 请求：

```
HTTP 400  GET /api/meta
```

Xcode Command Line Tools 不会「非常有选择性地」只让 `GET /api/meta → 400`。因此 Xcode 被合理排除。

### 不用 nvm，直接切换 Node 22

直接装官方 Node 22 `.pkg`：

```bash
node -v   # v22.23.2
npm run dev
```

Vite 正常启动，但页面仍然完全相同：`400 Bad Request /meta` + `meta.units.find`。

于是 **Node 24 被 A/B test 排除**：Node 24 → Error A，Node 22 → Error A，控制其他条件不变时，`Node version ≠ root cause`。

### 从 React Exception 回溯到 API Failure

前端的 `meta.units.find(...)` 表面看是 React/TS bug，但正确的分析要往前看一条错误：`GET /api/meta → 400 Bad Request`。

正常响应：

```json
{ "units": [...] }
```

异常响应：

```json
{ "info": "Invalid request!" }
```

所以 `meta.units` 不存在 → `undefined.find(...)` → `TypeError`。真正的 causal chain 是：

```
API failure
  → unexpected response schema
    → frontend state incomplete
      → unsafe property access
        → React crash
          → white screen
```

而不是「React crash → React 本身有问题」。

### Network Panel 是关键转折点

Safari DevTools → Network → `meta`：

```
URL:      http://localhost:5173/api/meta
Status:   400 Bad Request
Response: {"info":"Invalid request!"}
```

它证明：页面不是因为 JS bundle 无法加载，而是 API 返回了明确的错误 response。

### 检查 Vite Proxy

```ts
// vite.config.ts
server: {
  host: true,
  strictPort: true,
  proxy: { "/api": "http://localhost:10000" },
  hmr: { clientPort: 5173 },
}
```

配置本身没问题，调查范围收敛到 `localhost:10000` 上的服务。

### 直接 curl 后端是最关键的一步

```bash
curl -i http://localhost:10000/api/meta
# HTTP/1.1 400 Bad Request
# {"info":"Invalid request!"}
```

这已经证明：**问题与 React/Vite 无关**。`curl` 完全绕过了 Browser / React / TS / App.tsx / Vite，直接请求 10000 端口，仍然得到相同错误。问题一定位于 10000 端口或其服务端。

### 检查 FastAPI /api/meta 源码

```python
@router.get("/meta", response_model=MetaResponse)
def get_meta() -> dict:
    return {
        "units": unit_options(),
        "max_pdfs": MAX_PDFS,
        "max_file_mb": MAX_FILE_MB,
    }
```

这个函数的关键性质：**它没有任何代码路径会返回 400**，更没有 `{"info":"Invalid request!"}`。逻辑矛盾出现了：

```
源码说： GET /api/meta → 必然正常 return dict
实际：   GET /api/meta → HTTP 400 {"info":"Invalid request!"}
```

那么只有一个合理方向：**响应这个请求的服务并不是这份 FastAPI。**

### 另一个强信号：Uvicorn 已经退出

此前 terminal 出现过：

```
Finished server process [36417]
```

说明 Uvicorn server 进程已经结束。但此时 `curl http://localhost:10000/api/meta` 竟然仍得到 `HTTP 400`。

逻辑上：如果 Uvicorn 已停 + 10000 没其他服务，curl 应得到 `Connection refused`，而不是 `HTTP response`。因此必然意味着：**还有另一个进程在监听 TCP 10000。**

### 最终根因：端口冲突

```bash
lsof -nP -iTCP:10000 -sTCP:LISTEN
# COMMAND   PID   USER
# netdisk_s 746   liaoruoyan
# TCP 127.0.0.1:10000 (LISTEN)
```

至此 root cause 被确认。10000 端口不是 FastAPI（Uvicorn ❌），而是 **netdisk_s ✅**（某网盘进程）。

实际数据路径一直是：

```
React → Vite :5173 → Proxy /api → localhost:10000 → netdisk_s → 400 Invalid request
```

### 为什么 netdisk_s 如此具有迷惑性？

如果 10000 完全没程序监听，Vite proxy 会出现 `ECONNREFUSED`，很容易发现 backend 没启动。但 `netdisk_s` 恰好在监听 10000，且对 `/api/meta` 返回了一个**合法 HTTP response**：

```
400 Bad Request
Content-Type: application/json
{"info":"Invalid request!"}
```

从前端看，它很像「FastAPI 收到了 request，只是业务校验失败」——实际上完全不是。这是一个典型的 **valid response from the wrong service** 问题，比 Connection refused 更难排查。

### 修复端口冲突

```bash
kill 746
lsof -nP -iTCP:10000 -sTCP:LISTEN   # 无输出，端口已释放

uvicorn app.main:app --host 0.0.0.0 --port 10000
# INFO: Uvicorn running on http://0.0.0.0:10000
```

### 最终验证

```bash
curl -i http://localhost:10000/api/meta
# HTTP/1.1 200 OK
# server: uvicorn
# {"units":[...],"max_pdfs":10,"max_file_mb":50}
```

最关键的 Header 是 `server: uvicorn`——不仅 response schema 正确，也验证现在响应请求的确是正确的 FastAPI/Uvicorn。重启 `npm run dev`，`http://localhost:5173` 恢复正常。

---

## 三、这次排障中最有价值的几个 Debugging 思维

**1. Error message 不一定是 root cause。**

- `No matching distribution found for fastapi` 的真正 root cause 是 `SSL_CERTIFICATE_VERIFY_FAILED`；
- `meta.units.find` 的真正 root cause 是 `/api/meta` 返回了错误 schema；
- `/api/meta 400` 的真正 root cause 是请求打到了错误的 service。

所以调试时要不断问：**这条 error 是 cause，还是 symptom？**

**2. 一定要把层次拆开。**

本次系统至少有 9 层：macOS/network → Python/OpenSSL → pip/deps → FastAPI/Uvicorn → TCP ports → Vite proxy → HTTP API → React state → UI rendering。

如果混在一起 debug：`白屏 → 怀疑 Node → 装 nvm → 发现没 Xcode → 修 Xcode`，会离真正问题越来越远。更专业的方式是：`UI 报错 → 查 API → API 400 → 绕过 UI curl API → 仍 400 → 看 API source → 源码不可能 400 → 确认实际监听进程 → 发现 wrong service`。

**3. curl 在 Full-stack Debugging 中非常重要。**

这次 `curl` 起了两次决定性作用：

- `curl -I https://pypi.org` 证明 macOS HTTPS 正常、Python SSL 异常；
- `curl -i http://localhost:10000/api/meta` 证明 React/Vite 不是根因，10000 server 自己就在返回 400。

以后遇到 Web 项目问题，先问：**能不能用 curl 绕过其他层直接测试？**

**4. 对比 "Expected Output" 和 "Observed Output" 非常强。**

```
源码返回： {"units":[...]}
实际返回： {"info":"Invalid request!"}
```

这种情况下不要继续分析 `unit_options()`，因为 response 根本不是这个函数产生的。正确逻辑是：`Expected ≠ Observed → 可能不是我以为的代码在跑 → 检查 process / port / routing`。这个思维在 Docker / K8s / 多 backend / 微服务 / 反向代理场景里特别重要。

**5. 检查端口应该比检查业务代码更早。**

只要涉及 `:8000 / :10000 / :3000` 这类 backend 端口，启动前先：

```bash
lsof -nP -iTCP:10000 -sTCP:LISTEN
```

如果返回 `COMMAND PID ...`，先确认这个 PID 是不是你要启动的程序。这次如果一开始就做这一步，Node/Xcode 那一整条路线基本都能省掉。

---

## 四、以后推荐的标准启动顺序

**Backend：**

```bash
cd ~/Downloads/financial_report/backend
source venv/bin/activate
which python && which pip
lsof -nP -iTCP:10000 -sTCP:LISTEN   # 为空再继续
python -m uvicorn app.main:app --host 0.0.0.0 --port 10000
# 独立验证：
curl -i http://localhost:10000/api/health
curl -i http://localhost:10000/api/meta   # 确认 200 OK, server: uvicorn
```

**Frontend：**

```bash
cd ~/Downloads/financial_report/frontend
node -v   # 当前 v22.23.2
npm run dev
# 访问 http://localhost:5173/
```

**白屏时的 Debugging Playbook：**

1. Console → 找到第一条真正的 error
2. Network → 有没有 4xx/5xx 的 API 请求
3. 用 curl 绕过前端直接打 API
4. 对比源码返回值与实际返回值
5. 用 `lsof` 确认端口上监听的是不是预期进程

---

*（本复盘记录一次完整的本地排障过程：把每一层拆开验证，比反复重装环境可靠得多。）*

<!--lang:en-->

# From SSL Errors to a Blank Screen: A Full-stack Local Debugging Retrospective

This is a classic, instructive case: **multiple environment problems appeared in sequence, but the real cause of the blank screen was unrelated to any of the first ones.** Without verifying each layer separately, it's easy to keep reinstalling Python, Node, Xcode, and React in circles.

> Project: a `Financial Report` local web app — React + TypeScript + Vite 5.4.21 + Node.js (frontend) and FastAPI + Uvicorn + Python 3.12 (backend).

Local dev architecture:

```
Browser
  → http://localhost:5173
    → Vite Dev Server
      → /api/* Proxy
        → http://localhost:10000
          → FastAPI / Uvicorn
```

Two independent problems actually occurred:

- **Problem A: Python SSL certificate config broken** → deps wouldn't install.
- **Problem B: port 10000 occupied by another program** → blank screen.

---

## Part 1: Python Deps Won't Install

`pip install -r requirements.txt` failed with `SSLCertVerificationError: certificate verify failed`. `pip install uvicorn` also failed, and `uvicorn --version` returned `command not found`.

**Key judgment**: `No matching distribution found` doesn't mean PyPI lacks FastAPI — the real error was `CERTIFICATE_VERIFY_FAILED` *before* that:

```
pip can't reach PyPI over HTTPS
  → can't read the package index
    → pip sees no versions
      → shows versions: none
```

So: **the package is fine; SSL verification is the problem.**

### Verify the network layer: curl works, Python SSL doesn't

```bash
curl -I https://pypi.org   # HTTP/2 200
env | grep -i -E "proxy|SSL|REQUESTS|CURL"   # nothing
```

macOS DNS/Internet/HTTPS/PyPI are all fine; no proxy env vars interfere.

### Diagnose Python's SSL trust store

```bash
python3 -c "import ssl; print(ssl.get_default_verify_paths())"
# cafile=None, capath=None  → expects
# /Library/Frameworks/Python.framework/Versions/3.12/etc/openssl/cert.pem
ls -l .../cert.pem   # No such file or directory
```

**Python 3.12's expected CA bundle simply doesn't exist.**

### Why Install Certificates.command also fails

It first does `pip install certifi`, then symlinks Python's `cert.pem` to `certifi/cacert.pem` — a classic **bootstrap deadlock**: no cert → need the command → command needs HTTPS to fetch certifi.

Reinstalling Python 3.12.10 didn't fix it either: the binary reinstall doesn't resolve the cert-bundle bootstrap.

### Fix Python SSL via Anaconda's certifi

Conda base had a complete CA bundle:

```bash
python -c "import certifi; print(certifi.where())"
# /opt/anaconda3/lib/python3.13/site-packages/certifi/cacert.pem

sudo ln -sf /opt/anaconda3/lib/python3.13/site-packages/certifi/cacert.pem \
  /Library/Frameworks/Python.framework/Versions/3.12/etc/openssl/cert.pem

/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12 - <<'PY'
import urllib.request
print(urllib.request.urlopen("https://pypi.org").status)   # 200
PY
```

**Python's SSL trust chain restored.**

> **Debugging principle**: don't assume "no error = fixed." Design a test for the root cause. Here the root cause was "Python can't verify HTTPS certs," so the valid test is `urllib.request.urlopen("https://pypi.org")` returning `200` — **direct root-cause verification**.

Then `pip install -r requirements.txt` succeeded.

---

## Part 2: Frontend Starts but Blank Screen

`npm run dev` → `VITE v5.4.21 ready`. Node/npm/Vite/React compile/dev-server all ✅. But the browser is blank. Console:

```
Failed to load resource: 400 Bad Request (meta)
TypeError: undefined is not an object (evaluating 'meta.units.find')
```

### The initial Node 24 suspicion

Node was `v24.19.0`; the project previously used 22. A reasonable suspicion (major upgrades can break ESM/native deps/Vite plugins) — but it **needed verification, not assumption**.

`nvm install 22` failed (`command not found: nvm`); installing nvm failed on `xcode-select: No developer tools were found` (nvm needs `git`).

### Why missing Xcode isn't the cause

If Xcode/CLT truly broke the frontend, the error would appear at `npm install` / `node-gyp` (`clang: command not found`). But `VITE ready` already proved: Node runtime, Vite, JS/TS compile, React bundle, HMR all fine. The real failure was an app-layer HTTP request: `HTTP 400 GET /api/meta`. Xcode CLT doesn't selectively make only `/api/meta → 400`. Excluded.

### Switch to Node 22 directly (no nvm)

```bash
node -v   # v22.23.2
npm run dev   # still: 400 /meta + meta.units.find
```

**Node 24 A/B-tested out**: Node 24 → Error A, Node 22 → Error A. With other conditions constant, `Node version ≠ root cause`.

### Trace from the React exception back to API failure

`meta.units.find(...)` looks like a React/TS bug, but the earlier error is `GET /api/meta → 400 Bad Request`. Normal response: `{"units":[...]}`; actual: `{"info":"Invalid request!"}`. So `meta.units` is undefined → `undefined.find(...)` → `TypeError`. The real causal chain:

```
API failure → unexpected schema → incomplete state → unsafe access → React crash → blank
```

### Network Panel is the turning point

Safari DevTools → Network → `meta`: `Status: 400`, `Response: {"info":"Invalid request!"}`. Proves it's an API error response, not a failed JS bundle.

### Check the Vite proxy (fine), then curl the backend directly

```bash
curl -i http://localhost:10000/api/meta
# HTTP/1.1 400 Bad Request
# {"info":"Invalid request!"}
```

This proves **React/Vite are irrelevant** — `curl` bypasses them entirely and still gets the same error. The problem is at port 10000 or its server.

### Inspect the FastAPI /api/meta source

```python
@router.get("/meta", response_model=MetaResponse)
def get_meta() -> dict:
    return {"units": unit_options(), "max_pdfs": MAX_PDFS, "max_file_mb": MAX_FILE_MB}
```

This function **has no code path returning 400**, let alone `{"info":"Invalid request!"}`. Contradiction:

```
source:  GET /api/meta → always returns dict
actual:  GET /api/meta → HTTP 400 {"info":"Invalid request!"}
```

Only one direction left: **the service answering isn't this FastAPI.**

### Another strong signal: Uvicorn had already exited

Terminal showed `Finished server process [36417]`. Yet `curl localhost:10000/api/meta` still returned `HTTP 400`. Logically, if Uvicorn stopped and nothing else listened on 10000, curl would get `Connection refused`, not an HTTP response. So **another process is listening on TCP 10000.**

### Root cause: port conflict

```bash
lsof -nP -iTCP:10000 -sTCP:LISTEN
# COMMAND   PID   USER
# netdisk_s 746   liaoruoyan
# TCP 127.0.0.1:10000 (LISTEN)
```

10000 was **netdisk_s ✅** (a netdisk daemon), not FastAPI (Uvicorn ❌). The actual path:

```
React → Vite :5173 → Proxy /api → localhost:10000 → netdisk_s → 400 Invalid request
```

### Why netdisk_s is so deceptive

If nothing listened on 10000, Vite proxy would show `ECONNREFUSED` — backend-not-up is obvious. But `netdisk_s` happened to listen on 10000 and returned a **valid HTTP response** (`400`, `application/json`, `{"info":"Invalid request!"}`). From the frontend it looks like "FastAPI got the request but validation failed" — it wasn't. A classic **valid response from the wrong service**, harder to spot than connection refused.

### Fix the conflict

```bash
kill 746
lsof -nP -iTCP:10000 -sTCP:LISTEN   # empty
uvicorn app.main:app --host 0.0.0.0 --port 10000
# INFO: Uvicorn running on http://0.0.0.0:10000
```

### Final verification

```bash
curl -i http://localhost:10000/api/meta
# HTTP/1.1 200 OK
# server: uvicorn
# {"units":[...],"max_pdfs":10,"max_file_mb":50}
```

The `server: uvicorn` header confirms both the correct schema and that the right service is answering. Restart `npm run dev` → `http://localhost:5173` works.

---

## Three Most Valuable Debugging Mindsets

**1. An error message isn't necessarily the root cause.**

- `No matching distribution found for fastapi` → root cause `SSL_CERTIFICATE_VERIFY_FAILED`
- `meta.units.find` → root cause `/api/meta` returned wrong schema
- `/api/meta 400` → root cause request hit the wrong service

Always ask: **is this error a cause, or a symptom?**

**2. Separate the layers.**

This system has at least 9 layers: macOS/network → Python/OpenSSL → pip/deps → FastAPI/Uvicorn → TCP ports → Vite proxy → HTTP API → React state → UI. Mixed debugging (`blank → suspect Node → install nvm → no Xcode → fix Xcode`) drifts from the real problem. The disciplined path: `UI error → check API → API 400 → curl API past UI → still 400 → read API source → source can't 400 → confirm actual listener → wrong service`.

**3. curl is decisive in full-stack debugging.**

- `curl -I https://pypi.org` proved macOS HTTPS fine, Python SSL broken.
- `curl -i http://localhost:10000/api/meta` proved React/Vite aren't the cause; the 10000 server itself returns 400.

When a web project breaks, ask: **can I curl past the other layers and test directly?**

**4. Comparing Expected vs Observed output is powerful.**

```
source returns: {"units":[...]}
actual returns:  {"info":"Invalid request!"}
```

Don't keep analyzing `unit_options()` — that response wasn't produced by it. `Expected ≠ Observed → maybe the code I think is running isn't → check process / port / routing`. Vital in Docker / K8s / multi-backend / reverse-proxy setups.

**5. Check the port before the business code.**

For any backend port (`:8000 / :10000 / :3000`), before starting:

```bash
lsof -nP -iTCP:10000 -sTCP:LISTEN
```

If it returns `COMMAND PID ...`, confirm that PID is the program you intend to run. Doing this first would have skipped the entire Node/Xcode detour.

---

## Recommended Standard Startup Order

**Backend:**

```bash
cd ~/Downloads/financial_report/backend
source venv/bin/activate
which python && which pip
lsof -nP -iTCP:10000 -sTCP:LISTEN   # empty, then continue
python -m uvicorn app.main:app --host 0.0.0.0 --port 10000
curl -i http://localhost:10000/api/health
curl -i http://localhost:10000/api/meta   # 200 OK, server: uvicorn
```

**Frontend:**

```bash
cd ~/Downloads/financial_report/frontend
node -v   # v22.23.2
npm run dev   # http://localhost:5173/
```

**Blank-screen playbook:**

1. Console → first real error
2. Network → any 4xx/5xx API request
3. curl the API directly, past the frontend
4. compare source return vs actual return
5. `lsof` to confirm the port's listener is the expected process

---

*(This retrospective records one complete local debugging session: verifying each layer separately beats reinstalling the environment in circles.)*
