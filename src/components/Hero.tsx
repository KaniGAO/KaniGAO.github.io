import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '@/constants/siteConfig'
import SkillRadar from './SkillRadar'

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="container-custom">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <p className="mb-3 text-sm font-medium tracking-wider text-primary-500 uppercase">
              Welcome to my space
            </p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-primary-400 to-blue-600 bg-clip-text text-transparent">
                {SITE_CONFIG.title}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-lg text-gray-600 dark:text-gray-400 lg:mx-0">
              {SITE_CONFIG.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30"
              >
                查看项目
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 px-8 py-3 font-semibold transition-all hover:border-primary-500/50 hover:bg-primary-500/5"
              >
                了解更多
              </Link>
            </div>
          </div>

          {/* ECharts Radar */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SkillRadar />
          </div>
        </div>
      </div>
    </section>
  )
}
