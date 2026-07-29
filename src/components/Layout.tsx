import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import FXOverlay from './FXOverlay'

export default function Layout() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Global ambient background: faint instrument grid + corner glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid dark:bg-grid-dark" />
      <div className="pointer-events-none fixed -left-40 -top-40 -z-10 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-500/[0.07]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 -z-10 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-500/[0.06]" />

      <Header />
      <main key={pathname} className="flex-1 animate-fade-in pt-16">
        <Outlet />
      </main>
      <Footer />
      <FXOverlay />
    </div>
  )
}
