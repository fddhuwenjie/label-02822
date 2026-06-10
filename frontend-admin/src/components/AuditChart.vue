<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>资源审核时效</span>
    </template>
    <div ref="chartContainer" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getAuditChartOption } from '@/config/chartOptions'
import type { AuditTimeItem } from '@/config/chartOptions'

interface Props {
  data: AuditTimeItem[]
}

const props = defineProps<Props>()

const chartContainer = ref<HTMLElement | null>(null)
const { bindChartRef, updateOption } = useECharts()

const renderChart = () => {
  if (props.data?.length) {
    const option = getAuditChartOption(props.data)
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
