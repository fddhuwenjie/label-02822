<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span>资源类型占比</span>
          </template>
          <div ref="pieChartRef" class="chart-container" style="height: 320px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span>资源审核时效</span>
          </template>
          <div ref="auditChartRef" class="chart-container" style="height: 320px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span>各年级知识点资源覆盖度</span>
          </template>
          <div ref="radarChartRef" class="chart-container" style="height: 380px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { createPieOption, createAuditOption, createRadarOption } from '@/config/chartOptions'

interface FormatItem {
  name: string
  value: number
}

interface AuditTimeItem {
  type: string
  time: number
}

interface RadarItem {
  name: string
  value: number[]
}

interface CategoryPieData {
  formatData: FormatItem[]
  auditTimeData: AuditTimeItem[]
  radarData: RadarItem[]
}

const props = defineProps<{
  data: CategoryPieData
}>()

const { chartRef: pieChartRef, updateOption: updatePie } = useECharts()
const { chartRef: auditChartRef, updateOption: updateAudit } = useECharts()
const { chartRef: radarChartRef, updateOption: updateRadar } = useECharts()

const renderCharts = () => {
  if (props.data?.formatData?.length) {
    updatePie(createPieOption(props.data.formatData))
  }
  if (props.data?.auditTimeData?.length) {
    updateAudit(createAuditOption(props.data.auditTimeData))
  }
  if (props.data?.radarData?.length) {
    updateRadar(createRadarOption(props.data.radarData))
  }
}

watch(() => props.data, renderCharts, { deep: true, immediate: true })
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}
</style>
