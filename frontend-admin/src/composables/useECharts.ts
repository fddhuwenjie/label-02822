import { ref, watch, onMounted, onUnmounted, nextTick, Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

export function useECharts() {
  const chartInstance = ref<ECharts | null>(null)
  const chartRef = ref<HTMLElement | null>(null)

  let resizeObserver: ResizeObserver | null = null

  const initChart = () => {
    if (!chartRef.value) return
    if (chartInstance.value) return
    chartInstance.value = echarts.init(chartRef.value)
    setupResizeListener()
  }

  const updateOption = (option: EChartsOption, notMerge?: boolean) => {
    nextTick(() => {
      if (!chartInstance.value) {
        initChart()
      }
      if (chartInstance.value) {
        chartInstance.value.setOption(option, notMerge)
      }
    })
  }

  const setupResizeListener = () => {
    if (!chartRef.value || !chartInstance.value) return

    resizeObserver = new ResizeObserver(() => {
      chartInstance.value?.resize()
    })
    resizeObserver.observe(chartRef.value)

    window.addEventListener('resize', handleWindowResize)
  }

  const handleWindowResize = () => {
    chartInstance.value?.resize()
  }

  const disposeChart = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    window.removeEventListener('resize', handleWindowResize)
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  }

  watch(chartRef, (newVal) => {
    if (newVal && !chartInstance.value) {
      nextTick(() => {
        initChart()
      })
    }
  })

  onUnmounted(() => {
    disposeChart()
  })

  return {
    chartRef,
    updateOption,
    chartInstance
  }
}
