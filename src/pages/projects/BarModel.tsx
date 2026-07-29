import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Link } from 'react-router-dom'

const FACTORS = ['MKT_CAP', 'PE', 'VOLUME', 'MOM', 'REV', 'SIZE', 'VALUE', 'QUALITY']

// Placeholder covariance matrix — replace with your real Bar model analysis.
function buildCov(): [number, number, number][] {
  const data: [number, number, number][] = []
  for (let i = 0; i < FACTORS.length; i++) {
    for (let j = 0; j < FACTORS.length; j++) {
      const base = i === j ? 1 : Math.cos(i - j) * 0.55
      const v = +(base + (Math.random() - 0.5) * 0.2).toFixed(2)
      data.push([j, i, v])
    }
  }
  return data
}

export default function BarModel() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption({
      tooltip: { position: 'top' },
      grid: { top: 30, left: 90, right: 20, bottom: 70 },
      xAxis: {
        type: 'category',
        data: FACTORS,
        splitArea: { show: true },
        axisLabel: { color: '#94a3b8' },
      },
      yAxis: {
        type: 'category',
        data: FACTORS,
        splitArea: { show: true },
        axisLabel: { color: '#94a3b8' },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: { color: ['#3b4a6b', '#ffffff', '#e0529c'] },
        textStyle: { color: '#94a3b8' },
      },
      series: [
        {
          type: 'heatmap',
          data: buildCov(),
          label: {
            show: true,
            formatter: (p: { data: [number, number, number] }) =>
              p.data[2].toFixed(2),
            color: '#0b1020',
            fontSize: 11,
          },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
          },
        },
      ],
    })
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [])

  return (
    <div className="py-16">
      <div className="container-custom">
        <Link
          to="/projects"
          className="text-sm text-indigo-500 hover:text-indigo-400"
        >
          ← Back to Projects
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Bar Model — Factor Covariance Matrix</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Interactive demo: this is a <strong>sub-page</strong> living under{' '}
          <code>/projects/bar-model</code>. Swap the placeholder matrix for your real
          Bar model analysis (or embed your existing HTML) — the same shell wraps
          every tool/project you build.
        </p>
        <div
          ref={ref}
          className="mt-8 h-[520px] w-full rounded-xl border border-slate-200/60 bg-white/10 dark:bg-black/30"
        />
      </div>
    </div>
  )
}
