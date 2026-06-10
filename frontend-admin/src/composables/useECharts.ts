import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

export function useECharts() {
  const chartRef = ref<HTMLElement | null>(null)
  const chartInstance = ref<ECharts | null>(null)

  let resizeObserver: ResizeObserver | null = null

  const initChart = () => {
    if (!chartRef.value) return
    if (chartInstance.value) {
      chartInstance.value.dispose()
    }
    chartInstance.value = echarts.init(chartRef.value)
  }

  const updateOption = (option: EChartsOption) => {
    if (!chartInstance.value) {
      initChart()
    }
    if (chartInstance.value) {
      chartInstance.value.setOption(option, true)
    }
  }

  const handleResize = () => {
    chartInstance.value?.resize()
  }

  const bindChartRef = (el: HTMLElement | null) => {
    chartRef.value = el
    if (el) {
      nextTick(() => {
        initChart()
        if (resizeObserver) {
          resizeObserver.disconnect()
        }
        resizeObserver = new ResizeObserver(handleResize)
        resizeObserver.observe(el)
      })
    }
  }

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  })

  return {
    bindChartRef,
    updateOption,
    chartInstance
  }
}
