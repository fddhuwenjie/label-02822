<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>资源类型占比</span>
    </template>
    <div :ref="bindChartRef" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { buildPieOption, type FormatItem } from '@/config/chartOptions'

const props = defineProps<{
  data?: FormatItem[]
}>()

const { bindChartRef, updateOption } = useECharts()

watch(
  () => props.data,
  (val) => {
    if (!val?.length) return
    updateOption(buildPieOption(val))
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}

.chart-card :deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
