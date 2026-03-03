<template>
  <div class="operation full-screen">
    <div class="operation-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="系统配置" name="config">
          <el-card shadow="hover">
            <template #header>基础配置</template>
            <el-form :model="config" label-width="140px">
              <el-form-item label="站点名称">
                <el-input v-model="config.siteName" />
              </el-form-item>
              <el-form-item label="文件大小限制(MB)">
                <el-input-number v-model="config.maxSize" :min="1" :max="500" />
              </el-form-item>
              <el-form-item label="支持格式">
                <el-input v-model="config.formats" type="textarea" />
              </el-form-item>
              <el-form-item label="审核超时提醒(小时)">
                <el-input-number v-model="config.auditTimeout" :min="1" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveConfig">保存配置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="数据备份" name="backup">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>备份计划</template>
                <el-form label-width="100px">
                  <el-form-item label="备份周期">
                    <el-select v-model="backupConfig.cycle" style="width: 100%">
                      <el-option label="每日" value="day" />
                      <el-option label="每周" value="week" />
                      <el-option label="每月" value="month" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备份范围">
                    <el-radio-group v-model="backupConfig.scope">
                      <el-radio label="full">全量</el-radio>
                      <el-radio label="inc">增量</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="startBackup">立即备份</el-button>
                  </el-form-item>
                </el-form>
                <el-progress :percentage="backupProgress" :status="backupProgress === 100 ? 'success' : ''" />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>备份记录</template>
                <el-table :data="backupRecords" style="width: 100%">
                  <el-table-column prop="time" label="时间" width="160" />
                  <el-table-column prop="size" label="大小" width="80" />
                  <el-table-column prop="status" label="状态" width="80" />
                  <el-table-column label="操作" width="100">
                    <template #default="{ row }">
                      <el-button size="small" @click="restoreBackup(row)">恢复</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="系统监控" name="monitor">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>CPU 使用率</template>
                <div ref="cpuChartRef" class="chart-container" style="height: 180px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>内存使用率</template>
                <div ref="memChartRef" class="chart-container" style="height: 180px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>磁盘使用率</template>
                <div ref="diskChartRef" class="chart-container" style="height: 180px"></div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="16" style="margin-top: 16px">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>接口响应时长</template>
                <div ref="apiChartRef" class="chart-container" style="height: 220px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>并发访问量</template>
                <div ref="concurrentChartRef" class="chart-container" style="height: 220px"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="操作日志" name="log">
          <el-card v-loading="loading" shadow="hover">
            <template #header>
              <span>操作日志</span>
              <el-input v-model="logKeyword" placeholder="关键词搜索" style="width: 200px; margin-left: 12px" clearable />
            </template>
            <el-table :data="operationLogs" max-height="400" style="width: 100%">
              <el-table-column prop="user" label="操作人" width="80" />
              <el-table-column prop="action" label="操作" width="80" />
              <el-table-column prop="module" label="模块" width="100" />
              <el-table-column prop="detail" label="详情" min-width="200" />
              <el-table-column prop="time" label="时间" width="160" />
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="数据清理" name="clean">
          <el-card shadow="hover">
            <template #header>冗余数据清理</template>
            <el-alert title="检测到重复资源 12 个、无效标签 5 个、过期链接 3 个" type="warning" show-icon />
            <div style="margin-top: 16px">
              <el-button type="primary" @click="cleanData">一键清理</el-button>
              <el-button @click="optimize">性能优化建议</el-button>
            </div>
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

const activeTab = ref('config')
const loading = ref(false)
const config = reactive({
  siteName: '资源生态管理系统',
  maxSize: 100,
  formats: 'ppt, doc, mp4, pdf',
  auditTimeout: 24
})
const backupConfig = reactive({ cycle: 'day', scope: 'full' })
const backupProgress = ref(0)
const backupRecords = ref([
  { time: '2024-01-15 02:00', size: '256MB', status: '成功' },
  { time: '2024-01-14 02:00', size: '248MB', status: '成功' }
])
const logKeyword = ref('')
const operationLogs = ref([])
const cpuChartRef = ref(null)
const memChartRef = ref(null)
const diskChartRef = ref(null)
const apiChartRef = ref(null)
const concurrentChartRef = ref(null)

const saveConfig = () => ElMessage.success('配置已保存')
const startBackup = () => {
  backupProgress.value = 0
  const timer = setInterval(() => {
    backupProgress.value += 10
    if (backupProgress.value >= 100) {
      clearInterval(timer)
      ElMessage.success('备份完成')
    }
  }, 100)
}
const restoreBackup = () => ElMessage.success('恢复中...')
const cleanData = () => ElMessage.success('清理完成')
const optimize = () => ElMessage.info('建议：大视频文件可压缩、PPT 图片可优化')

const initGauge = (ref, value, title) => {
  if (!ref.value) return
  const chart = echarts.init(ref.value)
  chart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: { color: value > 80 ? '#f56c6c' : '#409eff' },
      progress: { show: true, width: 18 },
      axisLine: { lineStyle: { width: 18 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: { valueAnimation: true, formatter: '{value}%', offsetCenter: [0, '70%'] },
      data: [{ value }]
    }]
  })
}

const initLineChart = (ref, data, name) => {
  if (!ref.value) return
  const chart = echarts.init(ref.value)
  chart.setOption({
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: ['00:00', '06:00', '12:00', '18:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data, smooth: true, itemStyle: { color: '#409eff' } }],
    tooltip: { trigger: 'axis' }
  })
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const list = await api.get('/logs')
    operationLogs.value = list || []
  } catch (e) {
    ElMessage.error(e.message || '获取操作日志失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
  initGauge(cpuChartRef, 45, 'CPU')
  initGauge(memChartRef, 62, '内存')
  initGauge(diskChartRef, 78, '磁盘')
  initLineChart(apiChartRef, [120, 80, 95, 110, 85], '响应时长')
  initLineChart(concurrentChartRef, [50, 120, 180, 150, 80], '并发')
})
</script>

<style scoped>
.operation {
  overflow-y: auto;
}
</style>
