import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { NAV_LINKS, SITE_CONFIG } from '@/constants/siteConfig'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.05] bg-white/55 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#04060d]/55">
      <nav className="container-custom flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 bg-neon shadow-glow-red transition-transform duration-300 group-hover:scale-125" />
          <span className="font-pixel text-sm tracking-wide text-slate-800 dark:text-slate-200">
            {SITE_CONFIG.title}
          </span>
        </Link>

        {/* Desktop Nav — quiet, hairline presence */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                location.pathname === link.path
                  ? 'text-primary-500'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 rounded-md p-1.5 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-1.5 text-slate-600 dark:text-slate-400 md:hidden"
          aria-label="Open menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-black/[0.05] bg-white/90 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#04060d]/90 md:hidden">
          <div className="container-custom space-y-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-primary-500'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleTheme()
                setMobileMenuOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
