<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>近30天各年级资源访问量</span>
    </template>
    <div ref="chartRef" class="chart-container" style="height: 220px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { getGradeChartOption, type GradeVisitDataItem } from '@/config/chartOptions'

interface Props {
  gradeVisitData?: GradeVisitDataItem[]
}

const props = withDefaults(defineProps<Props>(), {
  gradeVisitData: () => []
})

const { chartRef, updateOption } = useECharts()

watch(
  () => props.gradeVisitData,
  (newVal) => {
    updateOption(getGradeChartOption(newVal))
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}
</style>
