<template>
  <div class="classification full-screen">
    <div v-loading="loading" class="classification-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="分类体系" name="tree">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>
                  <span>多级分类树</span>
                  <el-button type="primary" size="small" @click="addCategory">新增分类</el-button>
                </template>
                <el-tree
                  :data="categoryTree"
                  :props="{ label: 'label', children: 'children' }"
                  default-expand-all
                  node-key="id"
                  draggable
                  @node-click="handleNodeClick"
                >
                  <template #default="{ node, data }">
                    <span class="tree-node">
                      <span>{{ node.label }}</span>
                      <span class="tree-actions">
                        <el-button link type="primary" size="small" @click.stop="editCategory(data)">编辑</el-button>
                        <el-button link type="danger" size="small" @click.stop="deleteCategory(data)">删除</el-button>
                      </span>
                    </span>
                  </template>
                </el-tree>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>分类使用率统计</template>
                <div ref="categoryPieRef" class="chart-container" style="height: 280px"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="标签管理" name="tag">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>热门标签云</template>
                <div class="tag-cloud">
                  <el-tag v-for="t in hotTags" :key="t.name" :type="t.type" size="large" style="margin: 4px">
                    {{ t.name }} ({{ t.count }})
                  </el-tag>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>标签关联分析</template>
                <div ref="tagRelationRef" class="chart-container" style="height: 280px"></div>
              </el-card>
            </el-col>
          </el-row>
          <el-card shadow="hover" style="margin-top: 16px">
            <template #header>智能打标建议</template>
            <el-alert title="上传资源时自动提取关键词，生成标签建议" type="info" />
            <div class="tag-suggestions">
              <el-tag v-for="s in tagSuggestions" :key="s" closable style="margin: 4px">{{ s }}</el-tag>
              <el-button type="primary" size="small" @click="applyTags">一键采纳</el-button>
            </div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="分类洞察" name="insight">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>分类覆盖率</template>
                <div ref="coverageChartRef" class="chart-container" style="height: 300px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>分类活跃度</template>
                <div ref="activityChartRef" class="chart-container" style="height: 300px"></div>
              </el-card>
            </el-col>
          </el-row>
          <el-card shadow="hover" style="margin-top: 16px">
            <template #header>分类优化建议</template>
            <el-alert
              title="建议将「Scratch 教程」从「工具」分类调整至「课件」分类，以提升检索效率"
              type="warning"
              show-icon
            />
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { api } from '@/api'

const activeTab = ref('tree')
const loading = ref(false)
const categoryTree = ref([
  { id: 1, label: '课件', children: [
    { id: 11, label: 'PPT' },
    { id: 12, label: 'Word' }
  ]},
  { id: 2, label: '视频', children: [
    { id: 21, label: 'MP4' }
  ]},
  { id: 3, label: '题库' },
  { id: 4, label: '工具' }
])
const hotTags = ref([
  { name: 'Python编程', count: 125, type: '' },
  { name: '初中八年级', count: 98, type: 'success' },
  { name: '课堂教学', count: 76, type: 'info' }
])
const tagSuggestions = ref(['Python', '八年级', '编程入门'])
const categoryPieRef = ref(null)
const tagRelationRef = ref(null)
const coverageChartRef = ref(null)
const activityChartRef = ref(null)

const addCategory = () => ElMessage.success('打开新增分类对话框')
const editCategory = (d) => ElMessage.info('编辑：' + d.label)
const deleteCategory = (d) => ElMessage.warning('删除：' + d.label)
const handleNodeClick = (d) => {}
const applyTags = () => ElMessage.success('已采纳标签')

const initCategoryPie = () => {
  if (!categoryPieRef.value) return
  const chart = echarts.init(categoryPieRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 10 },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 42, name: '课件' },
        { value: 28, name: '视频' },
        { value: 15, name: '题库' },
        { value: 10, name: '工具' }
      ]
    }]
  })
}

const initTagRelation = () => {
  if (!tagRelationRef.value) return
  const chart = echarts.init(tagRelationRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 10 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 85, name: 'Python-八年级' },
        { value: 62, name: 'Excel-七年级' },
        { value: 45, name: '网络安全-九年级' }
      ]
    }]
  })
}

const initCoverage = () => {
  if (!coverageChartRef.value) return
  const chart = echarts.init(coverageChartRef.value)
  chart.setOption({
    grid: { left: 60, right: 30, top: 30, bottom: 60 },
    xAxis: { type: 'category', data: ['课件', '视频', '题库', '工具'] },
    yAxis: { type: 'value', max: 100 },
    series: [
      { type: 'bar', name: '实际', data: [85, 72, 65, 58], itemStyle: { color: '#409eff' } },
      { type: 'bar', name: '目标', data: [90, 80, 75, 70], itemStyle: { color: '#f56c6c' } }
    ],
    legend: { bottom: 10 },
    tooltip: { trigger: 'axis' }
  })
}

const initActivity = () => {
  if (!activityChartRef.value) return
  const chart = echarts.init(activityChartRef.value)
  chart.setOption({
    grid: { left: 60, right: 30, top: 30, bottom: 60 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月'] },
    yAxis: { type: 'value' },
    series: [
      { type: 'line', name: '下载量', data: [320, 450, 580], smooth: true },
      { type: 'line', name: '使用率', data: [65, 72, 78], smooth: true, yAxisIndex: 0 }
    ],
    legend: { bottom: 10 },
    tooltip: { trigger: 'axis' }
  })
}

const fetchClassifications = async () => {
  loading.value = true
  try {
    const list = await api.get('/classifications')
    categoryTree.value = list && list.length ? list : categoryTree.value
    initCategoryPie()
    initTagRelation()
    initCoverage()
    initActivity()
  } catch (e) {
    ElMessage.error(e.message || '获取分类数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchClassifications())
</script>

<style scoped>
.classification {
  overflow-y: auto;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tree-actions {
  margin-left: 8px;
}

.tag-cloud {
  min-height: 200px;
}

.tag-suggestions {
  margin-top: 12px;
}
</style>
