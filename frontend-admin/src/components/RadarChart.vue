<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>各年级知识点资源覆盖度</span>
    </template>
    <div ref="chartContainer" class="chart-container" style="height: 380px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getRadarChartOption } from '@/config/chartOptions'
import type { RadarDataItem } from '@/config/chartOptions'

interface Props {
  data: RadarDataItem[]
}

const props = defineProps<Props>()

const chartContainer = ref<HTMLElement | null>(null)
const { bindChartRef, updateOption } = useECharts()

const renderChart = () => {
  if (props.data?.length) {
    const option = getRadarChartOption(props.data)
    updateOption(option)
  }
}

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

onMounted(() => {
  if (chartContainer.value) {
    bindChartRef(chartContainer.value)
    renderChart()
  }
})
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}
</style>
