<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>近6个月资源上传量/下载量</span>
      <el-radio-group v-model="dimension" size="small" style="float: right">
        <el-radio-button label="学科">按学科</el-radio-button>
        <el-radio-button label="年级">按年级</el-radio-button>
      </el-radio-group>
    </template>
    <div :ref="bindChartRef" class="chart-container" style="height: 320px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { buildTrendOption } from '@/config/chartOptions'

const props = defineProps<{
  months?: string[]
  uploadTrend?: number[]
  downloadTrend?: number[]
}>()

const dimension = ref<'学科' | '年级'>('学科')
const { bindChartRef, updateOption } = useECharts()

const refresh = () => {
  updateOption(
    buildTrendOption(props.months ?? [], props.uploadTrend ?? [], props.downloadTrend ?? [])
  )
}

watch(
  () => [props.months, props.uploadTrend, props.downloadTrend, dimension.value],
  refresh,
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
