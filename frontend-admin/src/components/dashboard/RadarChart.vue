<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>各年级知识点资源覆盖度</span>
    </template>
    <div ref="chartRef" class="chart-container" style="height: 380px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getRadarChartOption, type RadarDataItem } from '@/config/chartOptions'

interface Props {
  radarData?: RadarDataItem[]
}

const props = withDefaults(defineProps<Props>(), {
  radarData: () => []
})

const { chartRef, updateOption } = useECharts()

watch(
  () => props.radarData,
  (newVal) => {
    updateOption(getRadarChartOption(newVal))
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}
</style>
