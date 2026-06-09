import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

export function useECharts() {
  const chartRef = ref<HTMLElement | null>(null)
  const chartInstance = shallowRef<echarts.ECharts | null>(null)

  const bindChartRef = (el: HTMLElement | null) => {
    chartRef.value = el
  }

  const updateOption = (option: EChartsOption) => {
    nextTick(() => {
      if (!chartRef.value) return
      if (!chartInstance.value) {
        chartInstance.value = echarts.init(chartRef.value)
      }
      chartInstance.value.setOption(option, true)
    })
  }

  const handleResize = () => {
    chartInstance.value?.resize()
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
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
