export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500/30 border-t-primary-500" />
      <p className="text-sm text-slate-500 dark:text-slate-400">加载中...</p>
    </div>
  )
}
