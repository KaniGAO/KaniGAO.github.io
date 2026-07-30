import { useEffect, useRef, useState } from 'react'
import SceneCanvas from '@/components/three/SceneCanvas'

const SCROLL_FADE_VH = 1.6 // fade fully out after 1.6 viewport heights

export default function SceneBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  // When true the Canvas stops its render loop entirely (see SceneCanvas).
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  // Fade + sink the 3D scene as the user scrolls, freeing attention for
  // content. Once fully faded (or the tab is hidden) we pause the WebGL loop
  // so it stops burning CPU/GPU in the background.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let hidden = typeof document !== 'undefined' ? document.hidden : false

    const setPausedIfChanged = (v: boolean) => {
      if (pausedRef.current !== v) {
        pausedRef.current = v
        setPaused(v)
      }
    }

    const update = () => {
      const vh = window.innerHeight
      const t = Math.min(Math.max(window.scrollY / (vh * SCROLL_FADE_VH), 0), 1)
      const eased = t * t * (3 - 2 * t)
      el.style.opacity = String(1 - eased)
      el.style.transform = `translateY(${(t * 10).toFixed(2)}vh) scale(${(1 + t * 0.05).toFixed(3)})`
      el.style.pointerEvents = window.scrollY > vh * 0.9 ? 'none' : 'auto'
      // No point rendering a scene the user can't see.
      setPausedIfChanged(hidden || t >= 1)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    const onVisibility = () => {
      hidden = document.hidden
      update()
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-auto fixed inset-0 -z-20 will-change-transform"
      aria-hidden="true"
    >
      {/* Neon-red halo bleeding from behind the head, top-right */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[110vmin] w-[110vmin] -translate-y-1/2 rounded-full halo blur-3xl" />
      <SceneCanvas paused={paused} />
    </div>
  )
}
