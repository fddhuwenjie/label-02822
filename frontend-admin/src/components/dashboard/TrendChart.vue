<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>近6个月资源上传量/下载量</span>
      <el-radio-group v-model="localDimension" size="small" style="float: right">
        <el-radio-button label="学科">按学科</el-radio-button>
        <el-radio-button label="年级">按年级</el-radio-button>
      </el-radio-group>
    </template>
    <div ref="chartRef" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getTrendChartOption } from '@/config/chartOptions'

interface Props {
  trendMonths?: string[]
  uploadTrend?: number[]
  downloadTrend?: number[]
  dimension?: string
}

const props = withDefaults(defineProps<Props>(), {
  trendMonths: () => [],
  uploadTrend: () => [],
  downloadTrend: () => [],
  dimension: '学科'
})

const emit = defineEmits<{
  (e: 'update:dimension', value: string): void
}>()

const { chartRef, updateOption } = useECharts()

const localDimension = ref(props.dimension)

watch(
  () => props.dimension,
  (newVal) => {
    localDimension.value = newVal
  }
)

watch(localDimension, (newVal) => {
  emit('update:dimension', newVal)
})

watch(
  () => [props.trendMonths, props.uploadTrend, props.downloadTrend, localDimension.value],
  () => {
    updateOption(getTrendChartOption(props.trendMonths, props.uploadTrend, props.downloadTrend))
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
