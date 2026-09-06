import { ref } from 'vue'
import { useAuth } from './useAuth'

const API_BASE_URL = 'https://linkly-backend-8vcp.onrender.com'

export interface ShortLink {
  id: string
  shortCode: string
  shortUrl: string
  destinationUrl: string
  userId?: string
  isEssential?: boolean
  clicks: number
  maxClicks?: number | null
  lastAccessedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateLinkOptions {
  customAlias?: string
  maxClicks?: number
}

export interface CreateLinkResponse {
  success: boolean
  link?: ShortLink
  error?: string
  isRenderingBackend?: boolean
}

export interface FetchLinksResponse {
  success: boolean
  links?: ShortLink[]
  total?: number
  error?: string
  isRenderingBackend?: boolean
}

export interface DeleteLinkResponse {
  success: boolean
  message?: string
  error?: string
  isRenderingBackend?: boolean
}

const isRenderingBackend = ref(false)

export function useLinks() {
  const { accessToken } = useAuth()
  const isLoading = ref(false)
  const linksList = ref<ShortLink[]>([])

  const createShortLink = async (
    url: string,
    options?: string | CreateLinkOptions
  ): Promise<CreateLinkResponse> => {
    isLoading.value = true
    isRenderingBackend.value = false
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (accessToken.value) {
        headers['Authorization'] = `Bearer ${accessToken.value}`
      }

      let opts: CreateLinkOptions = {}
      if (typeof options === 'string') {
        opts = { customAlias: options }
      } else if (options) {
        opts = options
      }

      const bodyPayload: Record<string, any> = { url: url.trim() }
      if (opts.customAlias && opts.customAlias.trim()) {
        bodyPayload.customAlias = opts.customAlias.trim()
      }
      if (opts.maxClicks !== undefined && opts.maxClicks !== null && opts.maxClicks > 0) {
        bodyPayload.maxClicks = Number(opts.maxClicks)
      }

      const response = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyPayload),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to shorten URL. Please try again.',
        }
      }

      return {
        success: true,
        link: data as ShortLink,
      }
    } catch (err: any) {
      isRenderingBackend.value = true
      return {
        success: false,
        isRenderingBackend: true,
        error: 'Backend is starting up (cold start). Rendering in progress...',
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserLinks = async (): Promise<FetchLinksResponse> => {
    if (!accessToken.value) {
      return { success: false, error: 'User is not authenticated' }
    }

    isLoading.value = true
    isRenderingBackend.value = false
    try {
      const response = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch links.',
        }
      }

      const fetchedLinks = data.links || []
      linksList.value = fetchedLinks

      return {
        success: true,
        links: fetchedLinks,
        total: data.total || fetchedLinks.length,
      }
    } catch (err: any) {
      isRenderingBackend.value = true
      return {
        success: false,
        isRenderingBackend: true,
        error: 'Backend is starting up (cold start). Rendering in progress...',
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteShortLink = async (shortCode: string): Promise<DeleteLinkResponse> => {
    if (!accessToken.value) {
      return { success: false, error: 'User is not authenticated' }
    }

    isLoading.value = true
    isRenderingBackend.value = false
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${encodeURIComponent(shortCode)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to delete short link.',
        }
      }

      linksList.value = linksList.value.filter((l) => l.shortCode !== shortCode)

      return {
        success: true,
        message: data.message || 'Link deleted successfully.',
      }
    } catch (err: any) {
      isRenderingBackend.value = true
      return {
        success: false,
        isRenderingBackend: true,
        error: 'Backend is starting up (cold start). Rendering in progress...',
      }
    } finally {
      isLoading.value = false
    }
  }

  const getBackendQrCodeUrl = (
    url: string,
    options?: { size?: number; dark?: string; light?: string }
  ): string => {
    const params = new URLSearchParams()
    params.set('url', url)
    if (options?.size) params.set('size', options.size.toString())
    if (options?.dark) params.set('dark', options.dark)
    if (options?.light) params.set('light', options.light)
    return `${API_BASE_URL}/api/qr?${params.toString()}`
  }

  return {
    isLoading,
    isRenderingBackend,
    linksList,
    createShortLink,
    fetchUserLinks,
    deleteShortLink,
    getBackendQrCodeUrl,
  }
}
