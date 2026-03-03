<template>
  <div class="permission full-screen">
    <div v-loading="loading" class="permission-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="角色权限" name="role">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>
                  <span>角色列表</span>
                  <el-button type="primary" size="small" @click="addRole">新增角色</el-button>
                </template>
                <div class="role-cards">
                  <el-card v-for="r in roleList" :key="r.id" class="role-card" shadow="hover">
                    <div class="role-name">{{ r.name }}</div>
                    <div class="role-perms">{{ r.permissions.join('、') }}</div>
                    <el-button size="small" @click="editRole(r)">编辑</el-button>
                  </el-card>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>权限矩阵</template>
                <el-table :data="roleMatrix" style="width: 100%">
                  <el-table-column prop="role" label="角色" width="120" />
                  <el-table-column prop="upload" label="上传" width="80">
                    <template #default="{ row }">
                      <el-switch v-model="row.upload" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="audit" label="审核" width="80">
                    <template #default="{ row }">
                      <el-switch v-model="row.audit" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="edit" label="编辑" width="80">
                    <template #default="{ row }">
                      <el-switch v-model="row.edit" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="delete" label="删除" width="80">
                    <template #default="{ row }">
                      <el-switch v-model="row.delete" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="export" label="导出" width="80">
                    <template #default="{ row }">
                      <el-switch v-model="row.export" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
          <el-card shadow="hover" style="margin-top: 16px">
            <template #header>权限使用频次</template>
            <div ref="permChartRef" class="chart-container" style="height: 280px"></div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="访问控制" name="access">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>访问日志</template>
                <el-table :data="accessLogs" max-height="300" style="width: 100%">
                  <el-table-column prop="user" label="用户" width="80" />
                  <el-table-column prop="resource" label="资源" min-width="120" />
                  <el-table-column prop="action" label="操作" width="80" />
                  <el-table-column prop="time" label="时间" width="160" />
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>资源级权限</template>
                <el-form label-width="100px">
                  <el-form-item label="可见范围">
                    <el-radio-group v-model="accessScope">
                      <el-radio label="本人">仅本人</el-radio>
                      <el-radio label="教研组">本教研组</el-radio>
                      <el-radio label="年级">本年级</el-radio>
                      <el-radio label="全校">全校</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="操作权限">
                    <el-checkbox-group v-model="accessOps">
                      <el-checkbox label="下载" />
                      <el-checkbox label="预览" />
                      <el-checkbox label="收藏" />
                      <el-checkbox label="评论" />
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="用户画像" name="profile">
          <el-card shadow="hover">
            <template #header>用户画像与推荐</template>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-card class="profile-card" shadow="hover">
                  <div class="profile-title">关注知识点</div>
                  <el-tag v-for="t in userTags" :key="t" style="margin: 4px">{{ t }}</el-tag>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="profile-card" shadow="hover">
                  <div class="profile-title">常用资源类型</div>
                  <div>课件 60%、视频 30%、题库 10%</div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="profile-card" shadow="hover">
                  <div class="profile-title">智能推荐</div>
                  <el-alert title="您常下载八年级 Python 资源，推荐以下新上传资源" type="success" />
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { api } from '@/api'

const activeTab = ref('role')
const loading = ref(false)
const roleList = ref([
  { id: 1, name: '超级管理员', permissions: ['全部'] },
  { id: 2, name: '资源管理员', permissions: ['上传', '审核', '编辑'] },
  { id: 3, name: '学科教师', permissions: ['上传', '编辑'] }
])
const roleMatrix = ref([
  { role: '超级管理员', upload: true, audit: true, edit: true, delete: true, export: true },
  { role: '资源管理员', upload: true, audit: true, edit: true, delete: false, export: true },
  { role: '学科教师', upload: true, audit: false, edit: true, delete: false, export: false }
])
const accessLogs = ref([
  { user: '张老师', resource: 'Python入门', action: '下载', time: '2024-01-15 10:30' },
  { user: '李老师', resource: 'Excel技巧', action: '预览', time: '2024-01-15 10:25' }
])
const accessScope = ref('本校')
const accessOps = ref(['下载', '预览'])
const userTags = ref(['Python编程', '八年级', '课堂教学'])
const permChartRef = ref(null)

const addRole = () => ElMessage.success('打开新增角色')
const editRole = (r) => ElMessage.info('编辑：' + r.name)

const fetchUsers = async () => {
  loading.value = true
  try {
    const list = await api.get('/users')
    if (list?.length) {
      roleList.value = list.map(u => ({ id: u.id, name: u.username || u.role, permissions: [u.role || '用户'] }))
    }
  } catch (e) {
    ElMessage.error(e.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
  setTimeout(() => {
    if (permChartRef.value) {
      const chart = echarts.init(permChartRef.value)
      chart.setOption({
      grid: { left: 60, right: 30, top: 30, bottom: 60 },
      xAxis: { type: 'category', data: ['上传', '审核', '编辑', '删除', '导出'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [45, 32, 28, 12, 25], itemStyle: { color: '#409eff' } }],
      tooltip: { trigger: 'axis' }
    })
    }
  }, 100)
})
</script>

<style scoped>
.permission {
  overflow-y: auto;
}

.role-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-name {
  font-weight: bold;
  min-width: 120px;
}

.role-perms {
  flex: 1;
  font-size: 12px;
  color: #666;
}

.profile-card {
  margin-bottom: 16px;
}

.profile-title {
  font-weight: bold;
  margin-bottom: 12px;
}
</style>
