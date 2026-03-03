import { ref, provide, inject } from 'vue'
import { api } from '@/api'

const AUTH_KEY = Symbol('auth')

export function createAuth() {
  const user = ref(null)
  const isLoggedIn = ref(false)

  async function login(username, password) {
    try {
      const res = await api.post('/login', { username, password })
      if (res.success && res.user) {
        user.value = res.user
        isLoggedIn.value = true
        sessionStorage.setItem('auth_user', JSON.stringify(user.value))
        return true
      }
    } catch (_) {}
    return false
  }

  function logout() {
    user.value = null
    isLoggedIn.value = false
    sessionStorage.removeItem('auth_user')
  }

  function initFromStorage() {
    const stored = sessionStorage.getItem('auth_user')
    if (stored) {
      user.value = JSON.parse(stored)
      isLoggedIn.value = true
    }
  }

  provide(AUTH_KEY, { user, isLoggedIn, login, logout, initFromStorage })
  return { user, isLoggedIn, login, logout, initFromStorage }
}

export function useAuth() {
  const auth = inject(AUTH_KEY)
  if (!auth) throw new Error('Auth not provided')
  return auth
}
