<template>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <span>高频使用资源 TOP5</span>
        </template>
        <div class="carousel-resources">
          <el-carousel height="200px" :interval="4000">
            <el-carousel-item v-for="(item, i) in topResources" :key="i">
              <div class="resource-item">
                <div class="res-name">{{ item.name }}</div>
                <div class="res-meta">上传：{{ item.teacher }} | 下载：{{ item.downloads }} | 年级：{{ item.grade }}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <span>近30天各年级资源访问量</span>
        </template>
        <div ref="chartRef" class="chart-container" style="height: 220px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useECharts } from '@/composables/useECharts'
import { createGradeVisitOption } from '@/config/chartOptions'

interface TopResource {
  name: string
  teacher: string
  downloads: number
  grade: string
}

interface GradeVisitItem {
  grade: string
  count: number
}

interface ResourceRankingData {
  topResources: TopResource[]
  gradeVisitData: GradeVisitItem[]
}

const props = defineProps<{
  data: ResourceRankingData
}>()

const { chartRef, updateOption } = useECharts()

const renderChart = () => {
  if (props.data?.gradeVisitData?.length) {
    updateOption(createGradeVisitOption(props.data.gradeVisitData))
  }
}

watch(() => props.data, renderChart, { deep: true, immediate: true })
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}

.resource-item {
  padding: 20px;
}

.res-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.res-meta {
  font-size: 14px;
  color: #666;
}
</style>
