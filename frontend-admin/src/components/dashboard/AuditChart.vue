<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>资源审核时效</span>
    </template>
    <div ref="chartRef" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getAuditChartOption, type AuditTimeDataItem } from '@/config/chartOptions'

interface Props {
  auditTimeData?: AuditTimeDataItem[]
}

const props = withDefaults(defineProps<Props>(), {
  auditTimeData: () => []
})

const { chartRef, updateOption } = useECharts()

watch(
  () => props.auditTimeData,
  (newVal) => {
    updateOption(getAuditChartOption(newVal))
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}
</style>
