<template>
  <div class="resource full-screen">
    <div class="resource-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="资源上传" name="upload">
          <el-card shadow="hover">
            <el-upload
              drag
              multiple
              :file-list="fileList"
              :on-change="handleFileChange"
              :auto-upload="false"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">拖拽文件到此处，或<em>点击上传</em></div>
            </el-upload>
            <div v-if="fileList.length" class="file-cards">
              <el-card v-for="(f, i) in fileList" :key="i" class="file-card" shadow="hover">
                <div>{{ f.name }}</div>
                <div class="file-meta">{{ formatSize(f.size) }} | {{ f.raw?.type || '未知格式' }}</div>
                <el-progress :percentage="f.percentage || 100" />
                <el-tag type="success" size="small">校验通过</el-tag>
              </el-card>
            </div>
            <el-steps :active="step" finish-status="success" align-center style="margin-top: 24px">
              <el-step title="上传" />
              <el-step title="基础信息" />
              <el-step title="分类标签" />
              <el-step title="权限设置" />
              <el-step title="提交审核" />
            </el-steps>
            <el-button type="primary" @click="step = Math.min(step + 1, 4)" style="margin-top: 16px">下一步</el-button>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="资源列表" name="list">
          <el-card v-loading="loading" shadow="hover">
            <el-row :gutter="16" class="filter-row">
              <el-col :span="4">
                <el-select v-model="filters.grade" placeholder="年级" clearable style="width: 100%">
                  <el-option label="六年级" value="6" />
                  <el-option label="七年级" value="7" />
                  <el-option label="八年级" value="8" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="filters.type" placeholder="资源类型" clearable style="width: 100%">
                  <el-option label="课件" value="课件" />
                  <el-option label="视频" value="视频" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input v-model="filters.keyword" placeholder="关键词搜索" clearable />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="searchResource">搜索</el-button>
              </el-col>
            </el-row>
            <el-radio-group v-model="viewMode" style="margin-bottom: 16px">
              <el-radio-button label="list">列表视图</el-radio-button>
              <el-radio-button label="grid">网格视图</el-radio-button>
            </el-radio-group>
            <div v-if="viewMode === 'list'" class="resource-list">
              <el-card v-for="r in resourceList" :key="r.id" class="resource-item-card" shadow="hover">
                <el-row :gutter="16" align="middle">
                  <el-col :span="2">
                    <div class="thumb">📄</div>
                  </el-col>
                  <el-col :span="6">{{ r.name }}</el-col>
                  <el-col :span="4">{{ r.teacher }}</el-col>
                  <el-col :span="4">
                    <el-tag size="small">{{ r.type }}</el-tag>
                    <el-tag size="small" type="success">{{ r.status }}</el-tag>
                  </el-col>
                  <el-col :span="4">下载 {{ r.downloads }}</el-col>
                  <el-col :span="4">
                    <el-button size="small" @click="previewResource(r)">预览</el-button>
                    <el-button size="small" @click="editResource(r)">编辑</el-button>
                    <el-button size="small" type="danger" @click="offlineResource(r)">下架</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
            <div v-else class="resource-grid">
              <el-card v-for="r in resourceList" :key="r.id" class="grid-card" shadow="hover">
                <el-checkbox v-model="r.checked" />
                <div class="thumb">📄</div>
                <div class="res-name">{{ r.name }}</div>
                <div class="res-meta">{{ r.teacher }} | {{ r.type }}</div>
                <el-button-group size="small">
                  <el-button @click="previewResource(r)">预览</el-button>
                  <el-button @click="editResource(r)">编辑</el-button>
                </el-button-group>
              </el-card>
            </div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="审核队列" name="audit">
          <el-card shadow="hover">
            <el-alert title="按优先级排序：紧急 > 普通 > 低" type="info" style="margin-bottom: 16px" />
            <el-card v-for="a in auditQueue" :key="a.id" class="audit-card" shadow="hover">
              <el-row :gutter="16">
                <el-col :span="2"><div class="thumb">📄</div></el-col>
                <el-col :span="6">
                  <div>{{ a.name }}</div>
                  <div class="meta">上传人：{{ a.teacher }} | 提交：{{ a.time }}</div>
                </el-col>
                <el-col :span="6">
                  <el-tag :type="a.priority === '紧急' ? 'danger' : 'info'" size="small">{{ a.priority }}</el-tag>
                  <div class="audit-items">待审核：信息完整性、内容合规性、格式适配性</div>
                </el-col>
                <el-col :span="6">
                  <el-button type="success" size="small" @click="approveAudit(a)">通过</el-button>
                  <el-button type="danger" size="small" @click="rejectAudit(a)">驳回</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="版本与归档" name="version">
          <el-card shadow="hover">
            <h4>版本管理</h4>
            <el-table :data="versionList" style="width: 100%">
              <el-table-column prop="version" label="版本" width="100" />
              <el-table-column prop="time" label="更新时间" />
              <el-table-column prop="desc" label="说明" />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button size="small" @click="rollback(row)">回滚</el-button>
                </template>
              </el-table-column>
            </el-table>
            <h4 style="margin-top: 24px">归档资源</h4>
            <el-table :data="archiveList" style="width: 100%">
              <el-table-column prop="name" label="资源名称" />
              <el-table-column prop="offlineTime" label="下架时间" />
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button size="small" @click="restore(row)">恢复上架</el-button>
                  <el-button size="small" type="danger" @click="deleteArchive(row)">永久删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { api } from '@/api'

const activeTab = ref('upload')
const step = ref(0)
const fileList = ref([])
const viewMode = ref('list')
const loading = ref(false)
const filters = reactive({ grade: '', type: '', keyword: '' })
const resourceList = ref([])
const auditQueue = ref([
  { id: 1, name: 'Python进阶', teacher: '张老师', time: '2024-01-15 10:30', priority: '紧急' },
  { id: 2, name: 'Excel函数', teacher: '李老师', time: '2024-01-14 15:20', priority: '普通' }
])
const versionList = ref([
  { version: 'v1.2', time: '2024-01-10', desc: '更新练习题' },
  { version: 'v1.1', time: '2024-01-05', desc: '修复错误' }
])
const archiveList = ref([
  { name: '旧版PPT', offlineTime: '2024-01-01' }
])

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

const handleFileChange = (file, list) => {
  fileList.value = list
}

const fetchResources = async () => {
  loading.value = true
  try {
    const list = await api.get('/resources')
    resourceList.value = (list || []).map(r => ({ ...r, checked: false }))
  } catch (e) {
    ElMessage.error(e.message || '获取资源列表失败')
  } finally {
    loading.value = false
  }
}

const searchResource = async () => {
  try {
    await fetchResources()
    ElMessage.success('搜索完成')
  } catch (e) {
    ElMessage.error(e.message || '搜索失败')
  }
}

const previewResource = (r) => ElMessage.info('预览：' + r.name)
const editResource = (r) => ElMessage.info('编辑：' + r.name)
const offlineResource = async (r) => {
  try {
    await api.delete(`/resources/${r.id}`)
    ElMessage.success('已下架')
    fetchResources()
  } catch (e) {
    ElMessage.error(e.message || '下架失败')
  }
}
const approveAudit = (a) => ElMessage.success('已通过：' + a.name)
const rejectAudit = (a) => ElMessage.warning('已驳回：' + a.name)
const rollback = (row) => ElMessage.success('已回滚到 ' + row.version)
const restore = (row) => ElMessage.success('已恢复：' + row.name)
const deleteArchive = (row) => ElMessage.warning('已删除：' + row.name)

onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
.resource {
  overflow-y: auto;
}

.filter-row .el-col {
  margin-bottom: 12px;
}

.file-cards {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.file-card {
  width: 200px;
}

.file-meta {
  font-size: 12px;
  color: #999;
  margin: 8px 0;
}

.resource-item-card {
  margin-bottom: 12px;
}

.thumb {
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.grid-card {
  position: relative;
}

.grid-card .el-checkbox {
  position: absolute;
  top: 8px;
  right: 8px;
}

.audit-card {
  margin-bottom: 12px;
}

.audit-card .meta, .audit-items {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
