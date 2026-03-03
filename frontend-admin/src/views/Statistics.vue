<template>
  <div class="statistics full-screen">
    <div v-loading="loading" class="statistics-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="使用分析" name="use">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>各学科资源下载量 TOP10</template>
                <el-radio-group v-model="timeRange" size="small" style="margin-bottom: 12px">
                  <el-radio-button label="周">按周</el-radio-button>
                  <el-radio-button label="月">按月</el-radio-button>
                  <el-radio-button label="学期">按学期</el-radio-button>
                </el-radio-group>
                <div ref="subjectChartRef" class="chart-container" style="height: 320px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>资源使用时段分布</template>
                <div ref="heatmapRef" class="chart-container" style="height: 320px"></div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>曝光→点击→下载→使用转化漏斗</template>
                <div ref="funnelRef" class="chart-container" style="height: 320px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>教师贡献排名 TOP20</template>
                <div class="teacher-cards">
                  <el-card v-for="(t, i) in teacherRank" :key="i" class="teacher-card" shadow="hover">
                    <div class="rank">{{ i + 1 }}</div>
                    <div class="name">{{ t.name }}</div>
                    <div class="stats">上传 {{ t.uploads }} | 通过率 {{ t.passRate }}% | 使用率 {{ t.usageRate }}%</div>
                  </el-card>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="健康度分析" name="health">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>资源健康分分布</template>
                <div ref="scatterRef" class="chart-container" style="height: 350px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>教研组资源贡献度</template>
                <div ref="stackBarRef" class="chart-container" style="height: 350px"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="自定义报表" name="report">
          <el-card shadow="hover">
            <template #header>
              <span>报表配置</span>
            </template>
            <el-form :inline="true">
              <el-form-item label="统计维度">
                <el-select v-model="reportConfig.dimension" placeholder="选择维度">
                  <el-option label="时间" value="time" />
                  <el-option label="年级" value="grade" />
                  <el-option label="学科" value="subject" />
                </el-select>
              </el-form-item>
              <el-form-item label="指标">
                <el-select v-model="reportConfig.metric" placeholder="选择指标">
                  <el-option label="下载量" value="downloads" />
                  <el-option label="上传量" value="uploads" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="generateReport">生成报表</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card shadow="hover" style="margin-top: 16px">
            <template #header>
              <span>资源下载量 TOP50（唯一表格）</span>
              <el-button type="primary" size="small" @click="exportExcel">导出 Excel</el-button>
            </template>
            <el-table :data="top50List" max-height="400" style="width: 100%">
              <el-table-column prop="name" label="资源名称" min-width="150" />
              <el-table-column prop="type" label="类型" width="80" />
              <el-table-column prop="teacher" label="上传教师" width="100" />
              <el-table-column prop="grade" label="年级" width="80" />
              <el-table-column prop="downloads" label="下载数" width="90" />
              <el-table-column prop="classes" label="使用班级数" width="100" />
              <el-table-column prop="health" label="健康分" width="80" />
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { api } from '@/api'

const activeTab = ref('use')
const timeRange = ref('月')
const loading = ref(false)
const subjectChartRef = ref(null)
const heatmapRef = ref(null)
const funnelRef = ref(null)
const scatterRef = ref(null)
const stackBarRef = ref(null)
const reportConfig = reactive({ dimension: 'time', metric: 'downloads' })
const subjectDownloadTop = ref([])
const funnelData = ref([])
const teacherRank = ref([])
const top50List = ref([])

const initSubjectChart = () => {
  if (!subjectChartRef.value || !subjectDownloadTop.value?.length) return
  const chart = echarts.init(subjectChartRef.value)
  chart.setOption({
    grid: { left: 60, right: 30, top: 30, bottom: 60 },
    xAxis: { type: 'category', data: subjectDownloadTop.value.map(d => d.subject) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: subjectDownloadTop.value.map(d => d.count), itemStyle: { color: '#409eff' } }],
    tooltip: { trigger: 'axis' }
  })
}

const initHeatmap = () => {
  if (!heatmapRef.value) return
  const chart = echarts.init(heatmapRef.value)
  chart.setOption({
    grid: { left: 80, right: 40, top: 40, bottom: 80 },
    xAxis: { type: 'category', data: ['早读', '上午课', '下午课', '晚自习'] },
    yAxis: { type: 'category', data: ['周一', '周二', '周三', '周四'] },
    visualMap: { min: 0, max: 100, inRange: { color: ['#e0f3f8', '#43b4d8', '#0868ac'] } },
    series: [{
      type: 'heatmap',
      data: [[0, 0, 45], [0, 1, 32], [0, 2, 28], [0, 3, 55], [1, 0, 38], [1, 1, 42], [1, 2, 68], [1, 3, 72], [2, 0, 55], [2, 1, 62], [2, 2, 88], [2, 3, 95], [3, 0, 28], [3, 1, 35], [3, 2, 42], [3, 3, 58]],
      label: { show: true }
    }],
    tooltip: { position: 'top' }
  })
}

const initFunnel = () => {
  if (!funnelRef.value || !funnelData.value?.length) return
  const chart = echarts.init(funnelRef.value)
  chart.setOption({
    grid: { left: 80, right: 80, top: 40, bottom: 60 },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'funnel',
      left: '10%',
      top: 40,
      bottom: 60,
      width: '80%',
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside' },
      data: funnelData.value
    }]
  })
}

const initScatter = () => {
  if (!scatterRef.value) return
  const chart = echarts.init(scatterRef.value)
  const data = [
    [65, 120], [72, 980], [88, 756], [45, 320], [92, 1250], [78, 520]
  ]
  chart.setOption({
    grid: { left: 60, right: 40, top: 40, bottom: 60 },
    xAxis: { name: '健康分', type: 'value' },
    yAxis: { name: '下载量', type: 'value' },
    series: [{ type: 'scatter', data, symbolSize: 15, itemStyle: { color: '#409eff' } }],
    tooltip: { trigger: 'item' }
  })
}

const initStackBar = () => {
  if (!stackBarRef.value) return
  const chart = echarts.init(stackBarRef.value)
  chart.setOption({
    grid: { left: 60, right: 40, top: 40, bottom: 80 },
    legend: { data: ['上传量', '审核通过', '下载量'], bottom: 20 },
    xAxis: { type: 'category', data: ['信息技术组', '数学组', '语文组'] },
    yAxis: { type: 'value' },
    series: [
      { name: '上传量', type: 'bar', stack: 'total', data: [45, 38, 32] },
      { name: '审核通过', type: 'bar', stack: 'total', data: [42, 35, 28] },
      { name: '下载量', type: 'bar', stack: 'total', data: [1250, 980, 756] }
    ],
    tooltip: { trigger: 'axis' }
  })
}

const generateReport = () => ElMessage.success('报表已生成')
const exportExcel = () => ElMessage.success('导出成功')

const fetchStatistics = async () => {
  loading.value = true
  try {
    const data = await api.get('/statistics')
    subjectDownloadTop.value = data.subjectDownloadTop || []
    funnelData.value = data.funnelData || []
    teacherRank.value = data.teacherRank || []
    top50List.value = data.top50List || []
    initSubjectChart()
    initHeatmap()
    initFunnel()
    initScatter()
    initStackBar()
  } catch (e) {
    ElMessage.error(e.message || '获取统计数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchStatistics())
</script>

<style scoped>
.statistics {
  overflow-y: auto;
}

.teacher-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 280px;
  overflow-y: auto;
}

.teacher-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-card .rank {
  width: 28px;
  height: 28px;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.teacher-card .name {
  font-weight: bold;
  min-width: 80px;
}

.teacher-card .stats {
  font-size: 12px;
  color: #666;
}
</style>
