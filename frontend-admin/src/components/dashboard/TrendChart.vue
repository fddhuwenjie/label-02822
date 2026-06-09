<template>
  <el-row :gutter="16">
    <el-col :span="24">
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <span>近6个月资源上传量/下载量</span>
          <el-radio-group v-model="dimension" size="small" style="float: right">
            <el-radio-button label="学科">按学科</el-radio-button>
            <el-radio-button label="年级">按年级</el-radio-button>
          </el-radio-group>
        </template>
        <div ref="chartRef" class="chart-container" style="height: 320px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { createTrendOption } from '@/config/chartOptions'

interface TrendChartData {
  trendMonths: string[]
  uploadTrend: number[]
  downloadTrend: number[]
}

const props = defineProps<{
  data: TrendChartData
}>()

const dimension = ref('学科')
const { chartRef, updateOption } = useECharts()

const renderChart = () => {
  if (props.data?.trendMonths) {
    updateOption(createTrendOption(props.data))
  }
}

watch(() => props.data, renderChart, { deep: true, immediate: true })
watch(dimension, renderChart)
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
