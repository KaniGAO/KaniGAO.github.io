import { useMemo } from 'react'
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
  { label: 'Sharpe Ratio', value: '0.91', color: 'text-indigo-500' },
  { label: 'Win Rate', value: '58.2%', color: 'text-cyan-500' },
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
          fillerColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.2)',
          handleStyle: { color: '#6366f1' },
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
          lineStyle: { width: 2, color: '#6366f1' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(99,102,241,0.35)' },
              { offset: 1, color: 'rgba(99,102,241,0.02)' },
            ]),
          },
          itemStyle: { color: '#6366f1' },
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
          lineStyle: { width: 2, color: '#f59e0b' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(245,158,11,0.3)' },
              { offset: 1, color: 'rgba(245,158,11,0.02)' },
            ]),
          },
          itemStyle: { color: '#f59e0b' },
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
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Quant Lab</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Backtesting results and key performance metrics analysis.
          </p>
        </div>

        {/* Charts */}
        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          {/* Left / Top: Strategy NAV */}
          <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/50">
            <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
              Strategy NAV Curve
            </h3>
            <div ref={navRef} style={{ width: '100%', height: '340px' }} />
          </div>

          {/* Right / Bottom: Benchmark NAV */}
          <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/50">
            <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
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
          <div className="overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/50 bg-gray-50 dark:border-gray-700/50 dark:bg-gray-800/50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric, i) => (
                  <tr
                    key={metric.label}
                    className={`border-b border-gray-200/50 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-800/30 ${
                      i % 2 === 0
                        ? 'bg-white dark:bg-gray-900/30'
                        : 'bg-gray-50/50 dark:bg-gray-800/20'
                    }`}
                  >
                    <td className="px-6 py-3.5 font-medium text-gray-700 dark:text-gray-300">
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
          <p className="mt-4 text-center text-xs text-gray-400">
            * Metrics are from simulated backtesting sample data, not actual performance.
          </p>
        </div>
      </div>
    </div>
  )
}
