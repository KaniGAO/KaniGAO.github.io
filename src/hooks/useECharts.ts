import { useRef, useEffect, useCallback } from 'react'
import * as echarts from 'echarts'

export function useECharts<T extends echarts.EChartsOption>(
  option: T,
  dependencies: unknown[] = []
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize chart
    chartRef.current = echarts.init(containerRef.current, 'dark')
    chartRef.current.setOption(option)

    // Resize handler with debounce
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => {
        chartRef.current?.resize()
      }, 150)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, dependencies)

  // Update option when it changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption(option, true)
    }
  }, [option])

  return { containerRef }
}
