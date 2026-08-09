---
title: "Git 版本管理混乱的整理与规范化"
titleEn: "Tidying Up and Standardizing a Messy Git Versioning Setup"
tags: ["Git", "GitHub", "SSH", "版本控制", "DevOps"]
date: "2026-07-29"
description: "记录对个人项目中 Git 版本管理混乱问题的系统梳理：分支策略、SSH 认证、敏感信息清理与自动化部署，形成可复用的规范化流程。"
descriptionEn: "A systematic cleanup of Git version-control chaos in a personal project — branching strategy, SSH auth, removing secrets, and automated deployment — into a reusable, standardized workflow."
---

# Git 版本管理混乱的整理与规范化

之前在项目里 Git 用得很随意：分支想建就建、提交信息五花八门、明文 token 留在仓库里、部署靠手动。时间一长，本地和远程对不上，回滚也回不动。这次花了一天把它系统梳理了一遍，形成一套能长期复用的规范。

## 一、问题诊断

先盘点现状，主要问题有四类：

1. **分支混乱**：既有 `main`、`master`，又有 `dev`、`feature-xxx`、`test` 等一堆杂分支，分不清哪个是上线分支。
2. **提交信息无规范**：`update`、`fix`、`改了一下` 这类信息没法从历史里读出做了什么。
3. **敏感信息泄露风险**：仓库里残留过 `.env` 明文 PAT（Personal Access Token），虽已移除，但历史提交里可能还有。
4. **部署靠手动**：每次上线要本地 build 再手动传，容易遗漏。

## 二、分支策略：拥抱 Trunk-based

决定采用 **trunk-based development**：

- `main` 即上线分支，始终保持可部署状态；
- 临时需求用短命分支（short-lived branch），做完即合入 `main`；
- 不长期保留 `dev`/`feature` 分支，避免分叉。

> 对个人项目来说，trunk-based 比 Git Flow 更轻、更不容易乱。

## 三、SSH 认证，干掉明文 PAT

原来 remote 用的是 `https://` + 明文 PAT，既不安全也麻烦。改成 SSH：

```bash
# 生成密钥（如已有可跳过）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 把公钥加到 GitHub，再把 remote 改为 SSH
git remote set-url origin git@github.com:KaniGAO/KaniGAO.github.io.git
```

之后推送不再需要每次输入 token，且密钥认证比明文 PAT 安全得多。

> 顺手把 `.env` 里残留的明文 PAT 移除，并建议在 GitHub 后台将其**撤销（revoke）**，因为一旦进过历史提交就无法靠删文件彻底清除。

## 四、提交信息规范化

统一采用 **Conventional Commits** 风格：

```
<type>(<scope>): <subject>
```

常用 `type`：`feat` / `fix` / `docs` / `refactor` / `chore` / `style`。

例如：

```
refactor: 收敛项目 tags 并给总筛选栏做 Tech/Domain 分组
blog: 新增《财报填表 Agent》技术复盘
```

这样 `git log` 一眼能看出每次改动的意图，也方便以后自动生成 changelog。

## 五、自动化部署（GitHub Actions）

项目是静态站点（Vite + React），用 `.github/workflows/deploy.yml` 实现推 `main` 即自动构建部署 GitHub Pages：

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

从此「推 main = 上线」，不再有手动环节。

## 六、清理与收尾

- 删除长期不用的杂分支（`git branch -d` / `-D`）；
- 给当前稳定状态打 tag：`git tag v1.0-expo-2026`；
- 在 README 写明开发/部署流程，避免后人（和自己）再踩坑。

## 七、沉淀下来的规范清单

1. 只用 `main` 作为上线分支，短命分支用完即删；
2. remote 用 SSH，绝不提交明文凭证；
3. 提交遵循 Conventional Commits；
4. 推 `main` 自动部署，不手动上线；
5. 稳定节点打 tag，方便回滚。

> 版本管理不是「能用就行」，它决定了你未来回滚、协作、上线的成本。早一天规范，少十天返工。

<!--lang:en-->

# Tidying Up and Standardizing a Messy Git Versioning Setup

I used Git carelessly before: branches created on a whim, commit messages all over the place, a plaintext token left in the repo, and manual deploys. Over time, local and remote drifted apart and rollbacks became impossible. I spent a day systematizing it into a reusable standard.

## 1. Diagnosis

Four problem classes stood out:

1. **Branch chaos**: a mix of `main`, `master`, `dev`, `feature-xxx`, `test` — no clear production branch.
2. **No commit convention**: `update`, `fix`, `tweaked` say nothing about what changed.
3. **Secret-leak risk**: a plaintext PAT once lived in `.env`; removed, but possibly still in history.
4. **Manual deploys**: build locally and upload by hand — easy to forget steps.

## 2. Branching: Embrace Trunk-based

Adopt **trunk-based development**:

- `main` is the production branch, always deployable;
- short-lived branches for features, merged right back;
- no long-lived `dev`/`feature` branches to avoid forks.

> For a personal project, trunk-based is lighter and less error-prone than Git Flow.

## 3. SSH Auth, Kill the Plaintext PAT

The remote used `https://` + plaintext PAT — insecure and annoying. Switch to SSH:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
git remote set-url origin git@github.com:KaniGAO/KaniGAO.github.io.git
```

No more token prompts, and key auth beats plaintext PAT. I also removed the leftover PAT from `.env` and recommend **revoking** it on GitHub — once it enters history, deleting the file doesn't erase it.

## 4. Commit Message Convention

Adopt **Conventional Commits**:

```
<type>(<scope>): <subject>
```

Common types: `feat` / `fix` / `docs` / `refactor` / `chore` / `style`.

Examples:

```
refactor: collapse project tags and group the filter bar by Tech/Domain
blog: add the financial-report-agent retrospective
```

Now `git log` reads as intent, and changelogs can be generated later.

## 5. Automated Deployment (GitHub Actions)

A static Vite + React site deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

"Push to main = ship" — no manual step left.

## 6. Cleanup

- Delete stale branches (`git branch -d` / `-D`);
- Tag the stable state: `git tag v1.0-expo-2026`;
- Document the dev/deploy flow in README.

## 7. The Standard Checklist

1. Only `main` is production; delete short-lived branches after use.
2. Use SSH remotes; never commit plaintext credentials.
3. Follow Conventional Commits.
4. Push to `main` deploys automatically — no manual release.
5. Tag stable points for easy rollback.

> Version control isn't "whatever works" — it decides the cost of your future rollbacks, collaboration, and releases. Standardize one day sooner, redo ten days less.
