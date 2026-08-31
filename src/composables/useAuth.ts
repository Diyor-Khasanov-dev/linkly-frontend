import { ref, computed } from 'vue'

const API_BASE_URL = 'https://linkly-backend-8vcp.onrender.com'
const TOKEN_STORAGE_KEY = 'linkly_access_token'
const USER_STORAGE_KEY = 'linkly_auth_user'

export interface User {
  id?: string
  email: string
  workspaceName?: string
  isEmailVerified?: boolean
  isVerificated?: boolean
  roles?: string[]
  name?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  user?: User
  accessToken?: string
}

const getInitialToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const accessToken = ref<string>(getInitialToken())
const currentUser = ref<User | null>(getInitialUser())
const isLoading = ref<boolean>(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!accessToken.value || !!currentUser.value)

  const saveAuthSession = (token: string, user: User) => {
    accessToken.value = token
    currentUser.value = user
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } catch (e) {
      console.error('Failed to save auth to localStorage:', e)
    }
  }

  const clearAuthSession = () => {
    accessToken.value = ''
    currentUser.value = null
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear auth from localStorage:', e)
    }
  }

  // POST /api/auth/register
  const register = async (workspaceName: string, email: string, password?: string): Promise<AuthResponse> => {
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceName: workspaceName || 'My Workspace',
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Registration failed. Please check your credentials.',
        }
      }

      return {
        success: true,
        message: data.message || 'Registration successful.',
        user: data.user,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error occurred during registration.',
      }
    } finally {
      isLoading.value = false
    }
  }

  // POST /api/auth/login
  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Login failed. Invalid email or password.',
        }
      }

      if (data.accessToken && data.user) {
        saveAuthSession(data.accessToken, data.user)
      }

      return {
        success: true,
        accessToken: data.accessToken,
        user: data.user,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error during login.',
      }
    } finally {
      isLoading.value = false
    }
  }

  // GET /api/auth/getme
  const fetchUser = async (): Promise<AuthResponse> => {
    if (!accessToken.value) {
      return { success: false, error: 'No access token available' }
    }

    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/getme`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthSession()
        }
        return {
          success: false,
          error: data.message || 'Failed to fetch user profile.',
        }
      }

      if (data.user) {
        currentUser.value = data.user
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
      }

      return {
        success: true,
        user: data.user,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error fetching user profile.',
      }
    } finally {
      isLoading.value = false
    }
  }

  // POST /api/auth/logout
  const logout = async (): Promise<AuthResponse> => {
    const currentToken = accessToken.value
    clearAuthSession()

    if (!currentToken) {
      return { success: true, message: 'Logged out.' }
    }

    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ accessToken: currentToken }),
      })
    } catch (e) {
      console.warn('Logout API call failed, session cleared locally:', e)
    }

    return { success: true, message: 'Logged out successfully.' }
  }

  return {
    accessToken,
    currentUser,
    isAuthenticated,
    isLoading,
    register,
    login,
    fetchUser,
    logout,
  }
}
