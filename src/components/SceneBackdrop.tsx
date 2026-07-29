import { useEffect, useRef } from 'react'
import SceneCanvas from '@/components/three/SceneCanvas'

/**
 * Promotes the 3D scene from a Hero-only canvas into a persistent, page-wide
 * backdrop. As the user scrolls it fades + sinks slightly so leaving the Hero
 * feels like drifting away from the "virtual space" rather than a hard cut at
 * 100vh. Pointer events are dropped once faded out, so dragging content below
 * never accidentally orbits the 3D head.
 */
export default function SceneBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      const vh = window.innerHeight
      // progress across the first ~1.6 viewports — slower fade keeps the scene
      // present while you're still in the Hero, then sinks it fully away so the
      // head + its blue glow "drift into the void" instead of leaving a lit disc.
      const t = Math.min(Math.max(window.scrollY / (vh * 1.6), 0), 1)
      const eased = t * t * (3 - 2 * t) // smoothstep, lingers through the Hero
      // Full fade to 0 — never leave a faint blue ghost behind on the black page.
      el.style.opacity = String(1 - eased)
      el.style.transform = `translateY(${(t * 10).toFixed(2)}vh) scale(${(1 + t * 0.05).toFixed(3)})`
      // Keep the head orbitable only inside the Hero; once scrolled past it,
      // disable pointer events so dragging cards never orbits the 3D head.
      el.style.pointerEvents = window.scrollY > vh * 0.9 ? 'none' : 'auto'
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-auto fixed inset-0 -z-20 will-change-transform"
      aria-hidden="true"
    >
      {/* Blue glow now lives HERE, inside the backdrop, so it shares the exact
          same scroll-fade as the 3D head — the light never lingers as a bright
          disc after the head has sunk into the void. */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[110vmin] w-[110vmin] -translate-y-1/2 rounded-full halo blur-3xl" />
      <SceneCanvas />
    </div>
  )
}
