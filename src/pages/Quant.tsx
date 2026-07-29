import { useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useECharts } from '@/hooks/useECharts'
import { useTheme } from '@/hooks/useTheme'
import strategyData from '@/data/strategyData.json'

interface StrategyPoint {
  date: string
  nav: number
  bench_nav: number
}

/** Key metrics (sample backtest values) */
const METRICS = [
  { label: 'Cumulative Return', value: '14.6%', color: 'text-green-500' },
  { label: 'Max Drawdown', value: '-9.7%', color: 'text-red-500' },
  { label: 'Sharpe Ratio', value: '0.91', color: 'text-primary-500' },
  { label: 'Win Rate', value: '58.2%', color: 'text-primary-500' },
]

export default function Quant() {
  const { isDark } = useTheme()

  const data = strategyData as StrategyPoint[]
  const dates = data.map((d) => d.date)
  const navValues = data.map((d) => d.nav)
  const benchValues = data.map((d) => d.bench_nav)

  const textColor = isDark ? '#e2e8f0' : '#1e293b'
  const gridColor = isDark ? '#334155' : '#e2e8f0'
  const axisColor = isDark ? '#94a3b8' : '#64748b'
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0'

  const baseOption = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        textStyle: { color: textColor, fontSize: 12 },
      },
      legend: {
        data: ['Strategy NAV', 'Benchmark NAV'],
        textStyle: { color: textColor, fontSize: 12 },
        top: 0,
      },
      grid: {
        top: 40,
        left: 50,
        right: 20,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { color: axisColor, fontSize: 10, rotate: 30 },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: axisColor, fontSize: 10 },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' as const } },
      },
      dataZoom: [
        {
          type: 'inside' as const,
          start: 0,
          end: 100,
        },
        {
          type: 'slider' as const,
          start: 0,
          end: 100,
          height: 20,
          bottom: 0,
          borderColor: gridColor,
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          fillerColor: isDark ? 'rgba(56,189,248,0.2)' : 'rgba(56,189,248,0.2)',
          handleStyle: { color: '#38bdf8' },
        },
      ],
    }),
    [dates, textColor, axisColor, gridColor, tooltipBg, tooltipBorder, isDark]
  )

  const navOption: EChartsOption = useMemo(
    () => ({
      ...baseOption,
      series: [
        {
          name: '策略净值',
          type: 'line',
          data: navValues,
          smooth: true,
          symbol: 'circle' as const,
          symbolSize: 4,
          lineStyle: { width: 2, color: '#38bdf8' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(56,189,248,0.35)' },
              { offset: 1, color: 'rgba(56,189,248,0.02)' },
            ]),
          },
          itemStyle: { color: '#38bdf8' },
        },
      ],
    }),
    [baseOption, navValues]
  )

  const benchOption: EChartsOption = useMemo(
    () => ({
      ...baseOption,
      series: [
        {
          name: '基准净值',
          type: 'line',
          data: benchValues,
          smooth: true,
          symbol: 'diamond' as const,
          symbolSize: 4,
          lineStyle: { width: 2, color: '#f5b544' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(245,181,68,0.3)' },
              { offset: 1, color: 'rgba(245,181,68,0.02)' },
            ]),
          },
          itemStyle: { color: '#f5b544' },
        },
      ],
    }),
    [baseOption, benchValues]
  )

  const { containerRef: navRef } = useECharts(navOption, [isDark])
  const { containerRef: benchRef } = useECharts(benchOption, [isDark])

  return (
    <div className="py-16">
      <div className="container-custom">
        <PageHeader
          eyebrow="Quant Lab"
          title="Quant Lab"
          subtitle="Backtesting results and key performance metrics analysis."
        />

        {/* Charts */}
        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          {/* Left / Top: Strategy NAV */}
          <div className="card-base p-4">
            <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
              Strategy NAV Curve
            </h3>
            <div ref={navRef} style={{ width: '100%', height: '340px' }} />
          </div>

          {/* Right / Bottom: Benchmark NAV */}
          <div className="card-base p-4">
            <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
              Benchmark NAV (CSI 300)
            </h3>
            <div ref={benchRef} style={{ width: '100%', height: '340px' }} />
          </div>
        </div>

        {/* Key Metrics Table */}
        <div className="mx-auto max-w-2xl">
          <h3 className="mb-4 text-center text-lg font-semibold">
            Key Performance Metrics
          </h3>
          <div className="overflow-hidden rounded-xl border border-slate-200/50 dark:border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/50 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric, i) => (
                  <tr
                    key={metric.label}
                    className={`border-b border-slate-200/50 transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04] ${
                      i % 2 === 0
                        ? 'bg-white dark:bg-transparent'
                        : 'bg-slate-50/50 dark:bg-white/[0.02]'
                    }`}
                  >
                    <td className="px-6 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {metric.label}
                    </td>
                    <td className={`px-6 py-3.5 font-semibold ${metric.color}`}>
                      {metric.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            * Metrics are from simulated backtesting sample data, not actual performance.
          </p>
        </div>
      </div>
    </div>
  )
}
