interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
}

/**
 * Shared title block for inner pages — keeps every page's header on the same
 * visual rhythm (pixel HUD eyebrow + display title + one-line subtitle).
 */
export default function PageHeader({ eyebrow, title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={`mb-12 text-center ${className ?? ''}`}>
      {eyebrow && <span className="eyebrow mb-3 block">{eyebrow}</span>}
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-slate-600 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}
