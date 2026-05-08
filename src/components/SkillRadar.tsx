import { useMemo } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useECharts } from '@/hooks/useECharts'
import { skills } from '@/data/skills'

export default function SkillRadar() {
  const option: EChartsOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        textStyle: { color: '#e2e8f0' },
      },
      radar: {
        indicator: skills.map((skill) => ({
          name: skill.name,
          max: 100,
        })),
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: '#94a3b8',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: { color: '#1e293b' },
        },
        axisLine: {
          lineStyle: { color: '#1e293b' },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(14, 165, 233, 0.02)', 'rgba(14, 165, 233, 0.05)'],
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: skills.map((s) => s.level),
              name: '技能水平',
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                width: 2,
                color: '#0ea5e9',
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(14, 165, 233, 0.35)' },
                  { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
                ]),
              },
              itemStyle: {
                color: '#38bdf8',
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
          ],
        },
      ],
    }),
    []
  )

  const { containerRef } = useECharts(option)

  return (
    <div className="w-full max-w-md">
      <h3 className="mb-4 text-center text-lg font-semibold">技能雷达</h3>
      <div ref={containerRef} style={{ width: '100%', height: '320px' }} />
    </div>
  )
}
