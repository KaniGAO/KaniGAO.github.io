import { useRef, useEffect } from 'react'

/**
 * Tracks page scroll as a 0->1 progress ref WITHOUT triggering re-renders.
 *
 * Designed to be read inside R3F's useFrame so the 3D scene can react to
 * scroll every frame without paying for React state updates on every scroll
 * event.
 *
 * @param range  The scroll distance that maps to progress=1.
 *               Defaults to one viewport height (i.e. the Hero section).
 */
export function useScrollProgress(range?: number) {
  const progress = useRef(0)

  useEffect(() => {
    const update = () => {
      const distance = range ?? window.innerHeight
      const y = window.scrollY
      progress.current = Math.min(Math.max(y / distance, 0), 1)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [range])

  return progress
}
