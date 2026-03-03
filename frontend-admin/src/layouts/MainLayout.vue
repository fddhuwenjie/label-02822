<template>
  <div class="main-layout">
    <el-container>
      <el-aside width="220px" class="sidebar">
        <div class="logo">资源生态管理</div>
        <el-menu
          :default-active="$route.path"
          router
          class="sidebar-menu"
          background-color="#1a1a2e"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <el-menu-item index="/dashboard">
            <span>数据驾驶舱</span>
          </el-menu-item>
          <el-menu-item index="/resource">
            <span>资源全生命周期</span>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <span>资源统计与分析</span>
          </el-menu-item>
          <el-menu-item index="/classification">
            <span>分类与标签体系</span>
          </el-menu-item>
          <el-menu-item index="/permission">
            <span>用户权限与访问控制</span>
          </el-menu-item>
          <el-menu-item index="/operation">
            <span>系统运维与数据保障</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container direction="vertical">
        <el-header class="header">
          <span class="header-title">{{ currentTitle }}</span>
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              {{ user?.username || 'admin' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useAuth } from '@/context/auth'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const titles = {
  '/dashboard': '数据驾驶舱',
  '/resource': '资源全生命周期管理',
  '/statistics': '资源统计与精准分析',
  '/classification': '资源分类与标签体系管理',
  '/permission': '用户权限与资源访问控制',
  '/operation': '系统运维与数据保障'
}

const currentTitle = computed(() => titles[route.path] || '资源生态管理系统')

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: #1a1a2e;
  overflow-y: auto;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #2d2d44;
}

.sidebar-menu {
  border: none;
}

.header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.main-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #f0f2f5;
  min-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
