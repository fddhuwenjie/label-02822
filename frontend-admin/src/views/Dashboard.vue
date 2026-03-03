<template>
  <div class="dashboard full-screen">
    <div v-loading="loading" class="dashboard-content">
      <!-- 核心指标卡片 -->
      <el-row :gutter="16" class="metric-row">
        <el-col :span="6">
          <el-card class="metric-card" shadow="hover">
            <div class="metric-title">总资源数</div>
            <div class="metric-value">{{ dashboardData.totalResources ?? '-' }}</div>
            <div class="metric-breakdown">
              <span v-for="f in dashboardData.formatData" :key="f.name">{{ f.name }} {{ f.value }}%</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card" shadow="hover">
            <div class="metric-title">本月新增资源</div>
            <div class="metric-value">{{ dashboardData.newThisMonth ?? '-' }} <el-tag type="success" size="small">+12%</el-tag></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card" shadow="hover">
            <div class="metric-title">累计下载量</div>
            <div class="metric-value">{{ dashboardData.totalDownloads ?? '-' }} <el-tag type="success" size="small">+18%</el-tag></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card metric-warning" shadow="hover">
            <div class="metric-title">待审核资源</div>
            <div class="metric-value">
              {{ dashboardData.pendingCount ?? '-' }}
              <el-badge :value="dashboardData.pendingCount ?? 0" class="badge-warning" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 活跃度卡片 -->
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
            <div ref="gradeChartRef" class="chart-container" style="height: 220px"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 趋势分析 -->
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
            <div ref="trendChartRef" class="chart-container" style="height: 320px"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分布与效率 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <span>资源类型占比</span>
            </template>
            <div ref="pieChartRef" class="chart-container" style="height: 320px"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <span>资源审核时效</span>
            </template>
            <div ref="auditChartRef" class="chart-container" style="height: 320px"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 覆盖率雷达 -->
      <el-row :gutter="16">
        <el-col :span="24">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <span>各年级知识点资源覆盖度</span>
            </template>
            <div ref="radarChartRef" class="chart-container" style="height: 380px"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 快捷操作与预警 -->
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
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { api } from '@/api'

const loading = ref(false)
const trendDimension = ref('学科')
const gradeChartRef = ref(null)
const trendChartRef = ref(null)
const pieChartRef = ref(null)
const auditChartRef = ref(null)
const radarChartRef = ref(null)
const dashboardData = ref({})
const topResources = ref([])

const initGradeChart = (gradeVisitData) => {
  if (!gradeChartRef.value || !gradeVisitData?.length) return
  const chart = echarts.init(gradeChartRef.value)
  chart.setOption({
    grid: { left: 50, right: 30, top: 20, bottom: 50 },
    xAxis: { type: 'category', data: gradeVisitData.map(d => d.grade) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: gradeVisitData.map(d => d.count), itemStyle: { color: '#409eff' } }],
    tooltip: { trigger: 'axis' }
  })
}

const initTrendChart = (trendMonths, uploadTrend, downloadTrend) => {
  if (!trendChartRef.value) return
  const chart = echarts.init(trendChartRef.value)
  chart.setOption({
    grid: { left: 60, right: 60, top: 40, bottom: 80 },
    legend: { data: ['上传量', '下载量'], bottom: 20 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendMonths || [] },
    yAxis: [
      { type: 'value', name: '上传量' },
      { type: 'value', name: '下载量' }
    ],
    series: [
      { name: '上传量', type: 'line', data: uploadTrend || [], smooth: true },
      { name: '下载量', type: 'line', yAxisIndex: 1, data: downloadTrend || [], smooth: true }
    ]
  })
}

const initPieChart = (resourceFormatData) => {
  if (!pieChartRef.value || !resourceFormatData?.length) return
  const chart = echarts.init(pieChartRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 20, top: 'center', itemGap: 16 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: resourceFormatData,
      label: { show: true, formatter: '{b}: {d}%' },
      avoidLabelOverlap: true
    }]
  })
}

const initAuditChart = (auditTimeData) => {
  if (!auditChartRef.value || !auditTimeData?.length) return
  const chart = echarts.init(auditChartRef.value)
  chart.setOption({
    grid: { left: 60, right: 30, top: 30, bottom: 60 },
    xAxis: { type: 'category', data: auditTimeData.map(d => d.type) },
    yAxis: { type: 'value', name: '平均时长(小时)' },
    series: [{ type: 'bar', data: auditTimeData.map(d => d.time), itemStyle: { color: '#67c23a' } }],
    tooltip: { trigger: 'axis' }
  })
}

const initRadarChart = (radarData) => {
  if (!radarChartRef.value || !radarData?.length) return
  const chart = echarts.init(radarChartRef.value)
  chart.setOption({
    grid: { left: 80, right: 80, top: 40, bottom: 80 },
    legend: { data: radarData.map(d => d.name), bottom: 20 },
    radar: {
      indicator: [
        { name: '六年级', max: 100 },
        { name: '七年级', max: 100 },
        { name: '八年级', max: 100 },
        { name: '九年级', max: 100 },
        { name: '高一', max: 100 }
      ]
    },
    series: [{ type: 'radar', data: radarData }]
  })
}

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
    initGradeChart(data.gradeVisitData)
    initTrendChart(data.trendMonths, data.uploadTrend, data.downloadTrend)
    initPieChart(data.formatData)
    initAuditChart(data.auditTimeData)
    initRadarChart(data.radarData)
  } catch (e) {
    ElMessage.error(e.message || '获取仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})

watch(trendDimension, () => {
  initTrendChart(dashboardData.value.trendMonths, dashboardData.value.uploadTrend, dashboardData.value.downloadTrend)
})
</script>

<style scoped>
.dashboard {
  overflow-y: auto;
}

.dashboard-content {
  max-width: 100%;
}

.metric-row {
  margin-bottom: 16px;
}

.metric-card {
  min-height: 120px;
}

.metric-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
}

.metric-breakdown {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.metric-value .el-tag {
  margin-left: 8px;
}

.metric-warning .metric-value {
  color: #e6a23c;
}

.badge-warning {
  margin-left: 8px;
}

.chart-card {
  margin-bottom: 16px;
}

.chart-card :deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.alert-list {
  padding: 0;
}
</style>
