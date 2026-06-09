import { onBeforeUnmount, shallowRef } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsCoreOption } from 'echarts'

export interface UseEChartsReturn {
  bindChartRef: (el: Element | null) => void
  updateOption: (option: EChartsCoreOption, opts?: { notMerge?: boolean }) => void
  chartInstance: ReturnType<typeof shallowRef<ECharts | null>>
}

/**
 * 通用 ECharts 生命周期 Hook
 * - 通过 bindChartRef 绑定 DOM 容器（用作 :ref="bindChartRef"）
 * - 自动监听 window.resize，并在容器尺寸变化时自适应
 * - 组件卸载时自动销毁实例与移除事件监听
 */
export function useECharts(): UseEChartsReturn {
  const chartInstance = shallowRef<ECharts | null>(null)
  let containerEl: HTMLElement | null = null
  let pendingOption: EChartsCoreOption | null = null
  let pendingNotMerge = false

  const handleResize = () => {
    chartInstance.value?.resize()
  }

  const disposeChart = () => {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  }

  const initChart = (el: HTMLElement) => {
    disposeChart()
    chartInstance.value = echarts.init(el)
    if (pendingOption) {
      chartInstance.value.setOption(pendingOption, pendingNotMerge)
      pendingOption = null
      pendingNotMerge = false
    }
  }

  const bindChartRef = (el: Element | null) => {
    if (el && el instanceof HTMLElement) {
      containerEl = el
      initChart(el)
      window.addEventListener('resize', handleResize)
    } else {
      // 元素被卸载
      window.removeEventListener('resize', handleResize)
      disposeChart()
      containerEl = null
    }
  }

  const updateOption = (option: EChartsCoreOption, opts: { notMerge?: boolean } = {}) => {
    if (chartInstance.value) {
      chartInstance.value.setOption(option, opts.notMerge ?? false)
    } else {
      // 容器尚未挂载时，缓存 option，等待 init 后再 setOption
      pendingOption = option
      pendingNotMerge = opts.notMerge ?? false
    }
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    disposeChart()
    containerEl = null
  })

  return { bindChartRef, updateOption, chartInstance }
}
