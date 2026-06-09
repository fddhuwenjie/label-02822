<template>
  <div class="dashboard full-screen">
    <div v-loading="loading" class="dashboard-content">
      <OverviewCards
        :total-resources="dashboardData.totalResources"
        :new-this-month="dashboardData.newThisMonth"
        :total-downloads="dashboardData.totalDownloads"
        :pending-count="dashboardData.pendingCount"
        :format-data="dashboardData.formatData"
      />

      <el-row :gutter="16">
        <el-col :span="12">
          <ResourceRankingChart :resources="topResources" />
        </el-col>
        <el-col :span="12">
          <GradeVisitChart :grade-visit-data="dashboardData.gradeVisitData" />
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="24">
          <TrendChart
            v-model:dimension="trendDimension"
            :trend-months="dashboardData.trendMonths"
            :upload-trend="dashboardData.uploadTrend"
            :download-trend="dashboardData.downloadTrend"
          />
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <CategoryPieChart :format-data="dashboardData.formatData" />
        </el-col>
        <el-col :span="12">
          <AuditChart :audit-time-data="dashboardData.auditTimeData" />
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="24">
          <RadarChart :radar-data="dashboardData.radarData" />
        </el-col>
      </el-row>

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

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import OverviewCards from '@/components/dashboard/OverviewCards.vue'
import ResourceRankingChart from '@/components/dashboard/ResourceRankingChart.vue'
import GradeVisitChart from '@/components/dashboard/GradeVisitChart.vue'
import TrendChart from '@/components/dashboard/TrendChart.vue'
import CategoryPieChart from '@/components/dashboard/CategoryPieChart.vue'
import AuditChart from '@/components/dashboard/AuditChart.vue'
import RadarChart from '@/components/dashboard/RadarChart.vue'

const loading = ref(false)
const trendDimension = ref('学科')
const dashboardData = ref({})
const topResources = ref([])

const quickUpload = () => ElMessage.success('跳转到上传页面')
const batchAudit = () => ElMessage.success('跳转到批量审核')
const categoryManage = () => ElMessage.success('跳转到分类管理')
const exportReport = () => ElMessage.success('报表导出中...')

const fetchDashboard = async () => {
  loading.value = true
  try {
    const data = await api.get('/dashboard')
    dashboardData.value = data
    topResources.value = data.topResources || []
  } catch (e) {
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
