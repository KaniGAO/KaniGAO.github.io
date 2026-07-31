import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { lazy, Suspense } from 'react'

// Code-split the WebGL scene so the heavy three.js bundle loads after the
// page content is interactive — much faster first paint, especially on mobile.
const SceneBackdrop = lazy(() => import('@/components/SceneBackdrop'))
import Reveal from '@/components/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { projects } from '@/data/projects'
import { getSortedPosts } from '@/utils/blog'

function Hotspot({
  to,
  label,
  outline,
}: {
  to: string
  label: string
  outline?: boolean
}) {
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-5 py-2 text-sm font-medium backdrop-blur transition-all duration-300 hover:scale-105 ${
        outline
          ? 'border border-slate-400/50 text-slate-700 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-400/10 dark:border-white/25 dark:text-white dark:hover:border-primary-400/60 dark:hover:text-primary-300'
          : 'bg-primary-500 text-white shadow-glow hover:bg-primary-400 hover:shadow-glow'
      }`}
    >
      {/* sweep shine on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{label}</span>
    </Link>
  )
}

/** Pixel-font HUD micro label — the "virtual space" instrumentation. */
function HudTag({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <span
      className={`pointer-events-none absolute font-pixel text-[9px] uppercase tracking-[0.22em] text-slate-400/80 dark:text-slate-500/80 ${className}`}
    >
      {children}
    </span>
  )
}

function Hero3D() {
  return (
    <section className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* The 3D stage now lives in the global SceneBackdrop (behind this
          page). The instrument grid is supplied by Layout's ambient layer so
          the Hero shares one continuous grid with the rest of the page. */}

      {/* NOTE: the right-side blue glow now lives inside SceneBackdrop so it
          fades + sinks with the 3D head — no more bright disc left on black. */}
      {/* Left-side neon-red bleed — mirrors the model's red rim so the left
          color stays unified with the rest of the page (page-light continues it
          below the fold). */}
      <div className="pointer-events-none absolute bottom-[-18%] left-[-8%] h-[64vmin] w-[64vmin] rounded-full bg-neon/[0.08] blur-3xl dark:bg-neon/[0.10]" />

      {/* HUD corner instrumentation */}
      <HudTag className="left-6 top-6 hidden sm:block lg:left-12">
        SYS.KANI_OS // v2.6
      </HudTag>
      <HudTag className="right-6 top-6 hidden sm:block lg:right-12">
        EXPO.2026 — SIGNAL LIVE
      </HudTag>
      <HudTag className="bottom-6 left-6 hidden md:block lg:left-12">
        22.31°N 114.17°E — HKG
      </HudTag>
      <HudTag className="bottom-6 right-6 hidden md:block lg:right-12">
        RENDER: WEBGL
      </HudTag>

      {/* Left readability scrim — only covers the copy zone so it never
          washes out the model on the right */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#eef2fa]/95 via-[#eef2fa]/60 to-transparent dark:from-[#04060d]/90 dark:via-[#04060d]/45 dark:to-transparent sm:w-[64%]" />

      {/* Copy — LEFT aligned, occupies left portion so it never overlaps the model */}
      <div className="pointer-events-none absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20">
        <div className="pointer-events-auto max-w-xl animate-fade-in">
          <p className="eyebrow mb-5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon shadow-glow-red" />
            </span>
            CUHK · Quant Finance · AI Builder
          </p>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            <span className="text-gradient-ink drop-shadow-sm dark:text-gradient dark:drop-shadow-[0_0_28px_rgba(56,189,248,0.35)]">
              Kani GAO
            </span>
          </h1>

          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            I build models that turn risk into signal — and an AI skills OS you
            can open from one URL.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Hotspot to="/projects" label="Projects" />
            <Hotspot to="/tools" label="Tools" />
            <Hotspot to="/agent" label="Ask Agent" />
            <Hotspot to="/about" label="Resume" outline />
          </div>

          <p className="mt-10 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>drag to look around</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span>scroll to turn me</span>
            <span className="animate-scroll-hint text-primary-500">↓</span>
          </p>
        </div>
      </div>

      {/* Bottom dissolve: the 3D stage sinks into the content below instead
          of a hard cut at 100vh, continuing the spatial narrative. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#eef2fa] dark:to-[#04060d]" />
    </section>
  )
}

function FeaturedProjects() {
  const featured = projects.filter((p) => p.roles?.includes('project')).slice(0, 3)

  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.28em] text-neon/70">
            02 / ARCHIVE
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Projects
          </h2>
        </div>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-400"
          >
            View all
            <span className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Exhibition rows: index number + oversized display title on neon glass */}
        <div className="space-y-5">
          {featured.map((project, index) => (
            <Reveal key={project.id} delay={index * 110} as="div">
              <Link
                to={project.route ?? '/projects'}
                className="card-neon group flex items-center gap-5 p-6 sm:gap-8 sm:p-8"
              >
                <span className="font-pixel text-sm text-neon/80 transition-colors group-hover:text-neon">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    {project.category}
                  </span>
                  <h3 className="truncate font-display text-2xl font-bold tracking-tight transition-all duration-300 group-hover:text-primary-500 group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.4)] sm:text-4xl lg:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                    {project.description}
                  </p>
                  <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <ArrowUpRight
                  className="h-6 w-6 shrink-0 text-slate-400 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-400 group-hover:opacity-100 sm:h-8 sm:w-8"
                  strokeWidth={1.5}
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function LatestPosts() {
  const posts = getSortedPosts().slice(0, 3)

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.28em] text-slate-400/70 dark:text-slate-500/70">
              03 / LOG
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Latest Posts
            </h2>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-400"
          >
            View all
            <span className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 90} as="div">
              <Link
                to={`/blog/${post.slug}`}
                className="card-base group flex h-full flex-col p-6"
              >
                <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
                  <time className="font-mono">{post.date}</time>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mb-2 font-display text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary-500 line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-primary-400/30 bg-primary-400/5 px-2 py-0.5 text-xs text-primary-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const prefersReduced = usePrefersReducedMotion()
  return (
    <>
      {/* Persistent 3D backdrop — fixed behind the page, fades/sinks as you
          scroll past the Hero so the scene feels continuous, not cut off.
          Skipped entirely when the user prefers reduced motion (no rAF loops). */}
      {!prefersReduced && (
        <Suspense fallback={null}>
          <SceneBackdrop />
        </Suspense>
      )}
      <Hero3D />
      {/* Content curtain: the scene dissolves from fully visible behind the
          Hero into a near-solid panel so the cards read clearly without a
          seam. The curtain sits behind the content but above the backdrop. */}
      <div className="relative isolate">
        {/* Continuous light field baked into the content curtain: a right-side
            blue + left-side red radial over a base that fades from clear at the
            top (meets the hero seamlessly) to near-solid below. The page reads
            as one space lit by the same source, not two cut panels. */}
        <div className="page-light pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <FeaturedProjects />
        <LatestPosts />
      </div>
    </>
  )
}
