---
title: "Hello World - 我的第一篇博客"
tags: ["介绍", "开始"]
date: "2025-01-15"
---

# Hello World - 我的第一篇博客

欢迎来到我的个人主页！这是我的第一篇博客文章。

## 关于这个项目

这个个人主页使用以下技术栈构建：

- **React 18** + **TypeScript 5** - 类型安全的前端框架
- **Vite 5** - 极速开发与构建工具
- **Tailwind CSS 3** - 原子化 CSS 框架
- **ECharts** - 数据可视化
- **react-markdown** - Markdown 渲染

## 代码示例

```typescript
// React 组件示例
import { useState } from 'react'

function Greeting({ name }: { name: string }) {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
```

## 未来计划

未来我会在这里分享更多关于前端开发、技术探索和个人项目的文章。敬请期待！

> "代码如诗，构建美好。"
