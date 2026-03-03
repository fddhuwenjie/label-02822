import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'resource', name: 'Resource', component: () => import('@/views/Resource.vue') },
      { path: 'statistics', name: 'Statistics', component: () => import('@/views/Statistics.vue') },
      { path: 'classification', name: 'Classification', component: () => import('@/views/Classification.vue') },
      { path: 'permission', name: 'Permission', component: () => import('@/views/Permission.vue') },
      { path: 'operation', name: 'Operation', component: () => import('@/views/Operation.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const stored = sessionStorage.getItem('auth_user')
  const isLoggedIn = !!stored

  if (to.meta.public) {
    if (isLoggedIn && to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (!isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
