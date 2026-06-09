<template>
  <div class="dashboard full-screen">
    <div v-loading="loading" class="dashboard-content">
      <OverviewCards :data="dashboardData" />

      <ResourceRankingChart
        :top-resources="dashboardData.topResources"
        :grade-visit-data="dashboardData.gradeVisitData"
      />

      <TrendChart
        :trend-months="dashboardData.trendMonths"
        :upload-trend="dashboardData.uploadTrend"
        :download-trend="dashboardData.downloadTrend"
      />

      <CategoryPieChart
        :format-data="dashboardData.formatData"
        :audit-time-data="dashboardData.auditTimeData"
        :radar-data="dashboardData.radarData"
      />

      <el-row :gutter="16">
        <el-col :span="12">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <span>快捷入口</span>
            </template>
            <div class="quick-actions">
              <el-button type="primary" @click="quickUpload">一键上传资源</el-button>
              <el-button type="success" @click="batchAudit">批量审核</el-button>
              <el-button type="info" @click="categoryManage">资源分类管理</el-button>
              <el-button type="warning" @click="exportReport">数据报表导出</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card chart-warning" shadow="hover">
            <template #header>
              <span>预警提示</span>
            </template>
            <div class="alert-list">
              <el-alert title="过期资源：近7天即将过期 5 个，已过期 2 个" type="warning" show-icon />
              <el-alert title="低使用率资源：下载量<5 的资源共 18 个" type="info" show-icon style="margin-top: 12px" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import type { DashboardData } from '@/config/chartOptions'
import OverviewCards from './dashboard/OverviewCards.vue'
import TrendChart from './dashboard/TrendChart.vue'
import CategoryPieChart from './dashboard/CategoryPieChart.vue'
import ResourceRankingChart from './dashboard/ResourceRankingChart.vue'

const loading = ref(false)
const dashboardData = ref<DashboardData>({})

const quickUpload = () => ElMessage.success('跳转到上传页面')
const batchAudit = () => ElMessage.success('跳转到批量审核')
const categoryManage = () => ElMessage.success('跳转到分类管理')
const exportReport = () => ElMessage.success('报表导出中...')

const fetchDashboard = async () => {
  loading.value = true
  try {
    const data = await api.get('/dashboard') as DashboardData
    dashboardData.value = data
  } catch (e: any) {
    ElMessage.error(e.message || '获取仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.dashboard {
  overflow-y: auto;
}

.dashboard-content {
  max-width: 100%;
}

.chart-card {
  margin-bottom: 16px;
}

.chart-card :deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.alert-list {
  padding: 0;
}
</style>
