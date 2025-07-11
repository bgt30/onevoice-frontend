import { getApiUrl, AUTH_CONFIG, ERROR_MESSAGES } from './config'

// HTTP Client Error Types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message)
    this.name = 'NetworkError'
  }
}

// Request/Response Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiErrorResponse {
  error: string
  message: string
  details?: any
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

// Token Management
class TokenManager {
  private static instance: TokenManager
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token)
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
  }

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, token)
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY)
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime + AUTH_CONFIG.TOKEN_EXPIRY_BUFFER / 1000
    } catch {
      return true
    }
  }
}

// HTTP Client Class
class HttpClient {
  private tokenManager = TokenManager.getInstance()
  private refreshPromise: Promise<string> | null = null

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    
    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.tokenManager.getRefreshToken()
    
    if (!refreshToken) {
      throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED)
    }

    const response = await fetch(getApiUrl('auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      this.tokenManager.clearTokens()
      throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED)
    }

    const data = await response.json()
    const newToken = data.access_token
    
    this.tokenManager.setToken(newToken)
    if (data.refresh_token) {
      this.tokenManager.setRefreshToken(data.refresh_token)
    }

    return newToken
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    let token = this.tokenManager.getToken()
    
    if (token && this.tokenManager.isTokenExpired(token)) {
      try {
        token = await this.refreshToken()
      } catch (error) {
        this.tokenManager.clearTokens()
        throw error
      }
    }

    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = ERROR_MESSAGES.SERVER_ERROR
      let errorData: any = null

      try {
        const errorResponse: ApiErrorResponse = await response.json()
        errorMessage = errorResponse.message || errorResponse.error
        errorData = errorResponse.details
      } catch {
        // If we can't parse the error response, use status-based messages
        switch (response.status) {
          case 401:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED
            break
          case 403:
            errorMessage = ERROR_MESSAGES.FORBIDDEN
            break
          case 404:
            errorMessage = ERROR_MESSAGES.NOT_FOUND
            break
          case 422:
            errorMessage = ERROR_MESSAGES.VALIDATION_ERROR
            break
        }
      }

      throw new ApiError(response.status, errorMessage, errorData)
    }

    try {
      const data: ApiResponse<T> = await response.json()
      return data.data
    } catch (error) {
      throw new NetworkError('Failed to parse response')
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<T> {
    const { headers = {}, timeout = 30000, signal, ...fetchOptions } = options
    
    try {
      const authHeaders = await this.getAuthHeaders()
      const url = getApiUrl(endpoint)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const finalSignal = signal || controller.signal

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...headers,
        },
        signal: finalSignal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout')
        }
        throw new NetworkError(error.message)
      }
      
      throw new NetworkError()
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...config })
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    })
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    })
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config })
  }

  // File upload method
  async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const authHeaders = await this.getAuthHeaders()
    const url = getApiUrl(endpoint)
    
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      })
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', async () => {
        try {
          const response = new Response(xhr.response, {
            status: xhr.status,
            statusText: xhr.statusText,
          })
          const result = await this.handleResponse<T>(response)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      xhr.addEventListener('error', () => {
        reject(new NetworkError('Upload failed'))
      })

      xhr.open('POST', url)
      
      // Set auth headers
      Object.entries(authHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.send(formData)
    })
  }

  // Clear authentication
  clearAuth(): void {
    this.tokenManager.clearTokens()
  }
}

// Export singleton instance
export const httpClient = new HttpClient()
export { TokenManager }
