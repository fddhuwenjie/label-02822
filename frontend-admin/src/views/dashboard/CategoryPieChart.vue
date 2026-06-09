<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span>资源类型占比</span>
          </template>
          <div :ref="bindPieRef" class="chart-container" style="height: 320px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span>资源审核时效</span>
          </template>
          <div :ref="bindAuditRef" class="chart-container" style="height: 320px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span>各年级知识点资源覆盖度</span>
          </template>
          <div :ref="bindRadarRef" class="chart-container" style="height: 380px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { createPieOption, createAuditOption, createRadarOption } from '@/config/chartOptions'
import type { FormatDataItem, AuditTimeItem, RadarSeriesItem } from '@/config/chartOptions'

const props = defineProps<{
  formatData?: FormatDataItem[]
  auditTimeData?: AuditTimeItem[]
  radarData?: RadarSeriesItem[]
}>()

const { bindChartRef: bindPieRef, updateOption: updatePieOption } = useECharts()
const { bindChartRef: bindAuditRef, updateOption: updateAuditOption } = useECharts()
const { bindChartRef: bindRadarRef, updateOption: updateRadarOption } = useECharts()

watch(() => props.formatData, (data) => {
  if (data?.length) {
    updatePieOption(createPieOption(data))
  }
}, { immediate: true })

watch(() => props.auditTimeData, (data) => {
  if (data?.length) {
    updateAuditOption(createAuditOption(data))
  }
}, { immediate: true })

watch(() => props.radarData, (data) => {
  if (data?.length) {
    updateRadarOption(createRadarOption(data))
  }
}, { immediate: true })
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
