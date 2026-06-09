<template>
  <div class="dashboard full-screen">
    <div v-loading="loading" class="dashboard-content">
      <OverviewCards :data="dashboardData" />

      <ResourceRankingChart :data="resourceRankingData" />

      <TrendChart :data="trendData" />

      <CategoryPieChart :data="categoryPieData" />

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
              <el-alert title="低使用率资源：下载量&lt;5 的资源共 18 个" type="info" show-icon style="margin-top: 12px" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import OverviewCards from '@/components/dashboard/OverviewCards.vue'
import ResourceRankingChart from '@/components/dashboard/ResourceRankingChart.vue'
import TrendChart from '@/components/dashboard/TrendChart.vue'
import CategoryPieChart from '@/components/dashboard/CategoryPieChart.vue'

interface DashboardData {
  totalResources?: number
  newThisMonth?: number
  totalDownloads?: number
  pendingCount?: number
  formatData?: Array<{ name: string; value: number }>
  topResources?: Array<{ name: string; teacher: string; downloads: number; grade: string }>
  gradeVisitData?: Array<{ grade: string; count: number }>
  trendMonths?: string[]
  uploadTrend?: number[]
  downloadTrend?: number[]
  auditTimeData?: Array<{ type: string; time: number }>
  radarData?: Array<{ name: string; value: number[] }>
}

const loading = ref(false)
const dashboardData = ref<DashboardData>({})

const resourceRankingData = computed(() => ({
  topResources: dashboardData.value.topResources || [],
  gradeVisitData: dashboardData.value.gradeVisitData || []
}))

const trendData = computed(() => ({
  trendMonths: dashboardData.value.trendMonths || [],
  uploadTrend: dashboardData.value.uploadTrend || [],
  downloadTrend: dashboardData.value.downloadTrend || []
}))

const categoryPieData = computed(() => ({
  formatData: dashboardData.value.formatData || [],
  auditTimeData: dashboardData.value.auditTimeData || [],
  radarData: dashboardData.value.radarData || []
}))

const quickUpload = () => ElMessage.success('跳转到上传页面')
const batchAudit = () => ElMessage.success('跳转到批量审核')
const categoryManage = () => ElMessage.success('跳转到分类管理')
const exportReport = () => ElMessage.success('报表导出中...')

const fetchDashboard = async () => {
  loading.value = true
  try {
    const data = await api.get('/dashboard')
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
