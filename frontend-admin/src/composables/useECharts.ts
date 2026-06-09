import { ref, onMounted, onUnmounted, watch, nextTick, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

export function useECharts() {
  const chartRef = ref<HTMLElement | null>(null)
  let chartInstance: ECharts | null = null

  const initChart = () => {
    if (!chartRef.value || chartInstance) return
    chartInstance = echarts.init(chartRef.value)
  }

  const updateOption = (newOption: EChartsOption) => {
    if (!chartInstance) {
      initChart()
    }
    if (chartInstance) {
      chartInstance.setOption(newOption, { notMerge: true })
    }
  }

  const handleResize = () => {
    chartInstance?.resize()
  }

  onMounted(() => {
    nextTick(() => {
      initChart()
    })
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    chartInstance?.dispose()
    chartInstance = null
  })

  return {
    chartRef,
    updateOption,
    get chartInstance() {
      return chartInstance
    }
  }
}
