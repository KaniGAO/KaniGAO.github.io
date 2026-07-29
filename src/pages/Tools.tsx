import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { Newspaper, Wrench } from 'lucide-react'

const TOOLS = [
  {
    name: 'Global Markets Briefing',
    desc: '一键生成每日全球市场早报（DOCX），可直发邮箱。基于 Bloomberg ASKB + 多源数据。',
    icon: Newspaper,
    status: 'live',
    to: '/tools/email-briefing',
  },
  {
    name: 'More skills coming…',
    desc: '你的早报、量化小工具、自动化脚本都会沉淀到这里，点开即用。',
    icon: Wrench,
    status: 'soon',
    to: '#',
  },
]

export default function Tools() {
  return (
    <div className="py-16">
      <div className="container-custom">
        <PageHeader
          eyebrow="Toolkit"
          title="Tools"
          subtitle="Practical AI skills I built — open the webpage and use them anywhere."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            const isLive = tool.status === 'live'
            return (
              <div
                key={tool.name}
                className="card-base group flex flex-col p-6 transition-all hover:border-primary-500/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isLive
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-slate-500/10 text-slate-500'
                    }`}
                  >
                    {isLive ? 'Live' : 'Soon'}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{tool.name}</h3>
                <p className="mb-4 flex-1 text-sm text-slate-600 dark:text-slate-400">
                  {tool.desc}
                </p>
                {isLive ? (
                  <Link
                    to={tool.to}
                    className="text-sm font-medium text-primary-500 hover:text-primary-400"
                  >
                    Open &rarr;
                  </Link>
                ) : (
                  <span className="text-sm text-slate-400">In progress</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
