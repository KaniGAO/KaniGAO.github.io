import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface SkillItem {
  subject: string
  value: number
  fullMark: number
}

const skillData: SkillItem[] = [
  { subject: 'Python', value: 78, fullMark: 100 },
  { subject: 'Risk Mgmt', value: 75, fullMark: 100 },
  { subject: 'AI Agent', value: 72, fullMark: 100 },
  { subject: 'Quant Strategy', value: 76, fullMark: 100 },
  { subject: 'Data Analysis', value: 74, fullMark: 100 },
  { subject: 'React / Web', value: 55, fullMark: 100 },
]

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-28"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="container-custom">
        <div
          className={`flex flex-col items-center gap-12 transition-all duration-700 lg:flex-row lg:gap-16 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-4 text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              Kani{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                GAO
              </span>
            </h1>
            <p className="mx-auto mb-2 max-w-xl text-lg text-gray-600 dark:text-gray-400 lg:mx-0">
              CUHK Undergraduate &mdash; B.Sc. Quantitative Finance &amp; Risk Management Science | CGPA 3.7/4.0
            </p>
            <p className="mx-auto mb-8 max-w-xl text-base italic text-gray-500 dark:text-gray-500 lg:mx-0">
              "Turning data into insights and risk into opportunity."
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                View Projects
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                to="/quant"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-8 py-3 font-semibold transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 dark:border-gray-700"
              >
                Quant Lab
              </Link>
            </div>
          </div>

          {/* Right: Recharts Radar */}
          <div
            className={`w-full max-w-sm transition-all delay-200 duration-700 ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h3 className="mb-4 text-center text-lg font-semibold">
              Skills Overview
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={skillData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickCount={5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value: any) => [`${value}`, 'Proficiency']}
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
