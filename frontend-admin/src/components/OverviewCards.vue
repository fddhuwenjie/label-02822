<template>
  <el-row :gutter="16" class="metric-row">
    <el-col :span="6">
      <el-card class="metric-card" shadow="hover">
        <div class="metric-title">总资源数</div>
        <div class="metric-value">{{ data.totalResources ?? '-' }}</div>
        <div class="metric-breakdown">
          <span v-for="f in data.formatData" :key="f.name">{{ f.name }} {{ f.value }}%</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="metric-card" shadow="hover">
        <div class="metric-title">本月新增资源</div>
        <div class="metric-value">{{ data.newThisMonth ?? '-' }} <el-tag type="success" size="small">+12%</el-tag></div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="metric-card" shadow="hover">
        <div class="metric-title">累计下载量</div>
        <div class="metric-value">{{ data.totalDownloads ?? '-' }} <el-tag type="success" size="small">+18%</el-tag></div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="metric-card metric-warning" shadow="hover">
        <div class="metric-title">待审核资源</div>
        <div class="metric-value">
          {{ data.pendingCount ?? '-' }}
          <el-badge :value="data.pendingCount ?? 0" class="badge-warning" />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import type { PieDataItem } from '@/config/chartOptions'

interface DashboardData {
  totalResources?: number
  newThisMonth?: number
  totalDownloads?: number
  pendingCount?: number
  formatData?: PieDataItem[]
}

interface Props {
  data: DashboardData
}

defineProps<Props>()
</script>

<style scoped>
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
</style>
