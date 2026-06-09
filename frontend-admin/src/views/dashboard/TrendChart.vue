<template>
  <el-row :gutter="16">
    <el-col :span="24">
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <span>近6个月资源上传量/下载量</span>
          <el-radio-group v-model="trendDimension" size="small" style="float: right">
            <el-radio-button label="学科">按学科</el-radio-button>
            <el-radio-button label="年级">按年级</el-radio-button>
          </el-radio-group>
        </template>
        <div :ref="bindChartRef" class="chart-container" style="height: 320px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { createTrendOption } from '@/config/chartOptions'

const props = defineProps<{
  trendMonths?: string[]
  uploadTrend?: number[]
  downloadTrend?: number[]
}>()

const trendDimension = ref('学科')
const { bindChartRef, updateOption } = useECharts()

const renderChart = () => {
  updateOption(createTrendOption(
    props.trendMonths || [],
    props.uploadTrend || [],
    props.downloadTrend || []
  ))
}

watch(() => [props.trendMonths, props.uploadTrend, props.downloadTrend] as const, () => {
  renderChart()
}, { immediate: true })

watch(trendDimension, () => {
  renderChart()
})
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
