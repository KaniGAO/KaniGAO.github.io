---
title: "个人网站的 Git 版本治理实战：从明文 Token 到 SSH + Trunk-Based 工作流"
tags: ["Git", "GitHub", "SSH", "版本控制", "DevOps"]
date: "2026-07-29"
description: "记录一次对个人主页仓库的 Git 版本治理：用 SSH 密钥替换掉写在 .git/config 里的明文 PAT，统一散乱的 feature/blog 分支，确立 trunk-based 开发流程，并打了 Expo 2026 里程碑 tag。"
githubUrl: "https://github.com/KaniGAO/KaniGAO.github.io"
---

# 个人网站的 Git 版本治理实战：从明文 Token 到 SSH + Trunk-Based 工作流

做个人网站最容易被忽略的一件事，不是设计也不是技术选型，而是**版本控制本身怎么管**。当分支越开越多、`.git/config` 里悄悄躺着一个明文 Personal Access Token 时，风险就悄悄 accumulating 了。这次我花了一下午把 KaniGAO.github.io 这个仓库彻底整理了一遍，顺便把流程固定成 trunk-based，记录在这里供以后回看。

## 为什么要治理

当时仓库有几个明显的隐患：

1. **明文凭证泄漏**：remote 的 URL 里直接嵌了 `ghp_…` 开头的 PAT，任何人拿到这台机器或这个 `.git/config` 都能以我的身份推仓库。
2. **分支散乱**：同时挂着 5 个未合进 `main` 的 feature/blog 分支，加上一个已合的 `fix/hashrouter-gh-pages`，本地和远端状态对不齐。
3. **部署耦合**：仓库用 `deploy.yml`，**推 `main` 即触发 GitHub Pages 自动构建上线**——这意味着合并或清理动作一旦出错，线上立刻挂。

目标很明确：推上去的内容里绝对不含密钥，分支收敛到主干，且保留 WebGL 大改造作为独立备份。

## 方案与执行

### 1. 用 SSH 密钥替换明文 PAT

本机没有 SSH 密钥对，于是：

```bash
ssh-keygen -t ed25519 -C "gaokanglin6@gmail.com" -f ~/.ssh/id_ed25519 -N ""
```

生成后把 `~/.ssh/id_ed25519.pub` 的公钥加到 GitHub（Settings → SSH and GPG keys → New SSH key），再把 remote 改回 SSH：

```bash
git remote set-url origin git@github.com:KaniGAO/KaniGAO.github.io.git
ssh -T git@github.com   # 返回 Hi KaniGAO! 即认证成功
```

私钥只在 `~/.ssh/`，URL 里完全没有 token，**推送内容从此不含任何密钥**。最后去 GitHub 把那个已泄露的 classic PAT 撤销（Developer settings → Personal access tokens → Revoke），服务器侧也失效。

### 2. 补 `.gitignore`

把 IDE / agent 产物加进忽略，避免 `.codebuddy/` 这类计划文件被误提交：

```gitignore
# IDE / agent artifacts
.codebuddy/
```

### 3. 分支合并（一个意外发现）

计划是逐个把 5 个分支合进 `main`。预查冲突时发现一个关键事实：**这 5 个分支其实之前已经通过 GitHub Pull Request（#2~#6）合并进 `origin/main` 了**。也就是说本地只是基于旧的 `origin/main` 做了分叉。

处理方式很干净：直接把本地 `main` reset 到 `origin/main` 作为权威基线，再叠加两项本地质量改进（`.codebuddy/` 忽略 + 修复合并引入的 `@import` CSS 构建警告），避免重复合并造成的冲突泥潭。

### 4. 本地 build 通过再推

因为推 `main` 即上线，合并后必须先验证：

```bash
npm run build   # tsc -b && vite build
```

构建通过后才 `git push origin main`。顺手修掉了一个 CSS 告警：`@import` 必须放在 `@tailwind` 指令之前才符合 CSS 规范，移到文件顶部后告警消失。

### 5. 里程碑 tag + 备份 + 清理

- WebGL 分支 `feature/immersive-webgl-redesign` 仅推 origin 备份，**不合 main**（deploy 只认 main，origin 上的分支不会被部署）。
- 打 annotated tag：`v1.0-expo-2026`，对应 Polymer Capital Tech Expo 2026 里程碑。
- 删除 5 个已合分支 + `fix/hashrouter-gh-pages` 的本地与远端引用，仓库回到「主干 + 一个备份分支」的清爽状态。

## 确立 Trunk-Based 后续流程

治理完的状态：

- **本地分支**：`main` + `feature/immersive-webgl-redesign`（WebGL 备份）
- **远端分支**：`origin/main` + `origin/feature/immersive-webgl-redesign`
- **Tag**：`v1.0-expo-2026`

以后约定很简单：

1. 小改动直接提交 `main` 并推送（自动部署上线）；
2. 大功能开短命 feature 分支，提 PR 合并，合完即删；
3. WebGL 这类「实验性大改造」走独立长期分支，需要时才 cherry-pick 或单独 PR 进主干；
4. 每个重要节点打 annotated tag。

## 踩坑小结

- **先 `fetch` 再下结论**：以为分支「未合」，结果远端早就通过 PR 合了。盲目本地合并只会制造分叉和冲突，对齐基线才是正解。
- **部署即上线要有「先 build 再 push」的纪律**：`deploy.yml` 不给你后悔的机会。
- **密钥用 SSH，别把 PAT 写进 URL**：前者可随时在 GitHub 侧吊销且不在仓库里留痕，后者一旦泄漏就是全仓库的读写权限。

整理完最大的感受是——版本控制不是「能推就行」，它决定了你半年后回看这个项目时，是能一眼看懂历史，还是面对一堆分叉分支和明文密钥发愁。
