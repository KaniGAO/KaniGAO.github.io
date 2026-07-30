import { useState } from 'react'

/**
 * Compact tag row shared by Projects / Agent / Tools cards.
 * Shows at most `max` tags; overflow collapses into a clickable "+N" chip
 * (dashed border) that expands the full list. Keeps cards readable when a
 * project carries 6-7 tags.
 */
export default function TagList({
  tags,
  max = 4,
  variant = 'rounded',
}: {
  tags: string[]
  max?: number
  /** 'rounded' = square-ish md chips (Projects), 'pill' = full pills (Agent) */
  variant?: 'rounded' | 'pill'
}) {
  const [expanded, setExpanded] = useState(false)

  const overflow = tags.length - max
  const visible = expanded || overflow <= 0 ? tags : tags.slice(0, max)

  const chipBase =
    variant === 'pill'
      ? 'rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs text-primary-500'
      : 'rounded-md bg-primary-400/10 px-2 py-0.5 text-xs font-medium text-primary-500 dark:text-primary-300'

  return (
    <div className="flex flex-wrap items-center gap-1.5 transition-all">
      {visible.map((tag) => (
        <span key={tag} className={chipBase}>
          {tag}
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
