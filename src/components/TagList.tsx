import { useState } from 'react'
import type { Tag } from '@/types'

/**
 * Compact tag row shared by Projects / Agent / Tools cards.
 * Tags are classified (`tech` | `domain`) so each kind gets its own color:
 *   - tech   → blue (tech-stack / libraries)
 *   - domain → neon red (field / problem space)
 * Shows at most `max` tags; overflow collapses into a clickable "+N" chip
 * (dashed border) that expands the full list. Keeps cards readable when a
 * project carries 6-7 tags. Legacy plain-string tags are treated as `tech`.
 */
type TagInput = Tag | string

function normalize(tag: TagInput): Tag {
  return typeof tag === 'string' ? { label: tag, kind: 'tech' } : tag
}

export default function TagList({
  tags,
  max = 4,
  variant = 'rounded',
}: {
  tags: TagInput[]
  max?: number
  /** 'rounded' = square-ish md chips (Projects), 'pill' = full pills (Agent) */
  variant?: 'rounded' | 'pill'
}) {
  const [expanded, setExpanded] = useState(false)

  const normalized = tags.map(normalize)
  const overflow = normalized.length - max
  const visible = expanded || overflow <= 0 ? normalized : normalized.slice(0, max)

  const chipBase =
    variant === 'pill'
      ? 'rounded-full px-2.5 py-0.5 text-xs'
      : 'rounded-md px-2 py-0.5 text-xs font-medium'

  const chipColor = (kind: Tag['kind']) =>
    kind === 'domain'
      ? 'bg-neon/10 text-neon border border-neon/30'
      : 'bg-primary-400/10 text-primary-500 dark:text-primary-300'

  return (
    <div className="flex flex-wrap items-center gap-1.5 transition-all">
      {visible.map((tag) => (
        <span key={tag.label} className={`${chipBase} ${chipColor(tag.kind)}`}>
          {tag.label}
        </span>
      ))}
      {!expanded && overflow > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`${
            variant === 'pill' ? 'rounded-full px-2.5' : 'rounded-md px-2'
          } cursor-pointer border border-dashed border-primary-500/40 bg-transparent py-0.5 text-xs font-medium text-primary-500/80 transition-colors hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-500`}
          aria-label={`Show ${overflow} more tags`}
        >
          +{overflow}
        </button>
      )}
      {expanded && overflow > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="cursor-pointer bg-transparent px-1 py-0.5 text-xs text-slate-400 transition-colors hover:text-slate-500 dark:hover:text-slate-300"
        >
          collapse
        </button>
      )}
    </div>
  )
}
