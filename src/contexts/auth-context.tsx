"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { httpClient, TokenManager } from '@/lib/http-client'
import { UserProfile, LoginRequest, SignupRequest, LoginResponse } from '@/types/api'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  signup: (userData: SignupRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (userData: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const tokenManager = TokenManager.getInstance()

  const isAuthenticated = !!user

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = tokenManager.getToken()
      if (token && !tokenManager.isTokenExpired(token)) {
        await fetchUser()
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      tokenManager.clearTokens()
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const userData = await httpClient.get<UserProfile>('users/profile')
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      tokenManager.clearTokens()
      setUser(null)
      throw error
    }
  }

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await httpClient.post<LoginResponse>('auth/login', credentials)
      
      // Store tokens
      tokenManager.setToken(response.accessToken)
      tokenManager.setRefreshToken(response.refreshToken)
      
      // Set user data
      setUser(response.user)
      
      // Redirect to dashboard or intended page
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
      router.push(redirectTo)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [router, tokenManager])

  const signup = useCallback(async (userData: SignupRequest) => {
    try {
      setIsLoading(true)
      await httpClient.post('auth/signup', userData)
      
      // Redirect to login with success message
      router.push('/login?message=Account created successfully. Please sign in.')
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [router])

  const logout = useCallback(() => {
    // Clear tokens and user data
    tokenManager.clearTokens()
    setUser(null)
    
    // Optional: Call logout endpoint to invalidate token on server
    httpClient.post('auth/logout').catch(console.error)
    
    // Redirect to login
    router.push('/login')
  }, [router, tokenManager])

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      await fetchUser()
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }, [isAuthenticated, logout])

  const updateUser = useCallback((userData: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }, [user])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { redirectTo?: string; requireAuth?: boolean } = {}
) {
  const { redirectTo = '/login', requireAuth = true } = options

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
        router.push(redirectUrl)
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      )
    }

    if (requireAuth && !isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}

// Hook for protected pages
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname
      const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
