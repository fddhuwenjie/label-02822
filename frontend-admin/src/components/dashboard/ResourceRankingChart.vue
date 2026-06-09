<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <span>高频使用资源 TOP5</span>
    </template>
    <div class="carousel-resources">
      <el-carousel height="200px" :interval="4000">
        <el-carousel-item v-for="(item, i) in resources" :key="i">
          <div class="resource-item">
            <div class="res-name">{{ item.name }}</div>
            <div class="res-meta">上传：{{ item.teacher }} | 下载：{{ item.downloads }} | 年级：{{ item.grade }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface ResourceItem {
  name: string
  teacher: string
  downloads: number
  grade: string
}

interface Props {
  resources?: ResourceItem[]
}

withDefaults(defineProps<Props>(), {
  resources: () => []
})
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
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
</style>
