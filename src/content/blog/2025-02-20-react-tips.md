---
title: "React 开发技巧分享"
tags: ["React", "TypeScript", "Frontend"]
date: "2025-02-20"
---

# React 开发技巧分享

在日常开发中积累的一些 React 实用技巧。

## 1. 自定义 Hooks 的力量

自定义 Hooks 是 React 中最强大的模式之一：

```typescript
// useLocalStorage - 持久化状态
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}
```

## 2. 性能优化要点

- 使用 `React.memo` 避免不必要的重渲染
- 合理使用 `useMemo` 和 `useCallback`
- 虚拟滚动处理长列表
- 代码分割与懒加载

## 3. TypeScript 最佳实践

```typescript
// 泛型组件示例
interface Props<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: Props<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

## 总结

持续学习和实践是提升技术能力的关键。
