<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>资源类型占比</span>
    </template>
    <div ref="chartRef" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getPieChartOption, type PieChartDataItem } from '@/config/chartOptions'

interface Props {
  formatData?: PieChartDataItem[]
}

const props = withDefaults(defineProps<Props>(), {
  formatData: () => []
})

const { chartRef, updateOption } = useECharts()

watch(
  () => props.formatData,
  (newVal) => {
    updateOption(getPieChartOption(newVal))
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}
</style>
