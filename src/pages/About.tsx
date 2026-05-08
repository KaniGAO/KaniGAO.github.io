import { timeline } from '@/data/timeline'
import { SOCIAL_LINKS, SITE_CONFIG } from '@/constants/siteConfig'

function TimelineIcon({ type }: { type: string }) {
  const styles: Record<string, string> = {
    work: 'bg-blue-500',
    education: 'bg-green-500',
    project: 'bg-purple-500',
    other: 'bg-orange-500',
  }
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles[type] || 'bg-gray-500'} shadow-lg`}>
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {type === 'work' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.958 23.958 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        )}
        {type === 'education' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        )}
        {type === 'project' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        )}
        {!['work', 'education', 'project'].includes(type) && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        )}
      </svg>
    </div>
  )
}

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'github':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    case 'mail':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    default:
      return null
  }
}

export default function About() {
  return (
    <div className="py-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">About Me</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Undergraduate student at CUHK, passionate about quantitative finance.
          </p>
        </div>

        {/* Profile Section */}
        <div className="mx-auto mb-20 max-w-2xl">
          <div className="card-base p-8 text-center animate-fade-in">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-blue-600 text-4xl font-bold text-white shadow-lg shadow-primary-500/30">
              K
            </div>
            <h2 className="text-2xl font-bold">Kani GAO</h2>
            <p className="mt-1 text-primary-500">{SITE_CONFIG.subtitle}</p>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {SITE_CONFIG.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-500">
              Currently an undergraduate at The Chinese University of Hong Kong (CUHK),
              majoring in Quantitative Finance and Risk Management Science with CGPA 3.7/4.0.
              Passionate about alpha factor research, risk modeling, and algorithmic trading strategies.
              I believe in the power of data-driven decision-making in finance.
            </p>

            {/* Contact */}
            <div className="mt-8 flex justify-center gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-2xl font-bold">Experience</h2>
          <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          {/* Timeline Line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-purple-500 to-transparent" />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.id} className="relative pl-14 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <TimelineIcon type={item.type} />

                <div className="card-base p-5">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-primary-500">{item.date}</span>
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
