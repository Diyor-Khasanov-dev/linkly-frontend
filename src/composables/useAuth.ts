import { ref, computed } from 'vue'

const AUTH_STORAGE_KEY = 'linkly_auth_user'

export interface User {
  email: string
  name?: string
}

const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const currentUser = ref<User | null>(getInitialUser())
const pendingEmail = ref<string>('')
const isLoading = ref<boolean>(false)

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)

  const register = async (email: string, _password?: string) => {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    pendingEmail.value = email
    isLoading.value = false
    return { success: true }
  }

  const verifyOtp = async (code: string) => {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (code && code.length >= 4) {
      const user: User = {
        email: pendingEmail.value || 'user@linkly.com',
        name: (pendingEmail.value || 'user@linkly.com').split('@')[0],
      }
      currentUser.value = user
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      pendingEmail.value = ''
      isLoading.value = false
      return { success: true }
    }
    isLoading.value = false
    return { success: false, error: 'Invalid verification code' }
  }

  const login = async (email: string, _password?: string) => {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    const user: User = {
      email,
      name: email.split('@')[0],
    }
    currentUser.value = user
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    isLoading.value = false
    return { success: true }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return {
    currentUser,
    pendingEmail,
    isAuthenticated,
    isLoading,
    register,
    verifyOtp,
    login,
    logout,
  }
}
