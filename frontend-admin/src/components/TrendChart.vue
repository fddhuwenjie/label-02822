<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>近6个月资源上传量/下载量</span>
      <el-radio-group v-model="dimension" size="small" style="float: right">
        <el-radio-button label="学科">按学科</el-radio-button>
        <el-radio-button label="年级">按年级</el-radio-button>
      </el-radio-group>
    </template>
    <div ref="chartContainer" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getTrendChartOption } from '@/config/chartOptions'
import type { TrendData } from '@/config/chartOptions'

interface Props {
  data: TrendData
}

const props = defineProps<Props>()

const dimension = ref('学科')
const chartContainer = ref<HTMLElement | null>(null)
const { bindChartRef, updateOption } = useECharts()

const renderChart = () => {
  if (props.data.months?.length) {
    const option = getTrendChartOption(props.data)
    updateOption(option)
  }
}

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

watch(dimension, () => {
  renderChart()
})

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

.chart-card :deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
