import { QueryClient } from '@tanstack/react-query'
import { ApiError, NetworkError } from './http-client'
import { ERROR_MESSAGES } from './config'

// Default query options
const defaultQueryOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount: number, error: unknown) => {
      // Don't retry on authentication errors
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        return false
      }
      
      // Don't retry on validation errors
      if (error instanceof ApiError && error.status === 422) {
        return false
      }
      
      // Retry network errors up to 3 times
      if (error instanceof NetworkError) {
        return failureCount < 3
      }
      
      // Retry server errors up to 2 times
      if (error instanceof ApiError && error.status >= 500) {
        return failureCount < 2
      }
      
      return false
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    retry: false, // Don't retry mutations by default
  },
}

// Create query client instance
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
})

// Query keys factory
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: ['auth', 'user'] as const,
  },
  
  // Videos
  videos: {
    all: ['videos'] as const,
    lists: () => [...queryKeys.videos.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.videos.lists(), params] as const,
    details: () => [...queryKeys.videos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.videos.details(), id] as const,
    status: (id: string) => [...queryKeys.videos.detail(id), 'status'] as const,
    analytics: (id: string) => [...queryKeys.videos.detail(id), 'analytics'] as const,
    languages: ['videos', 'languages'] as const,
    voices: (languageCode: string) => ['videos', 'voices', languageCode] as const,
  },
  
  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    subscription: () => [...queryKeys.user.all, 'subscription'] as const,
    credits: () => [...queryKeys.user.all, 'credits'] as const,
    creditUsage: (params: Record<string, unknown>) => [...queryKeys.user.credits(), 'usage', params] as const,
    dashboardStats: () => [...queryKeys.user.all, 'dashboardStats'] as const,
    notifications: () => [...queryKeys.user.all, 'notifications'] as const,
    notificationPreferences: () => [...queryKeys.user.all, 'notificationPreferences'] as const,
    activityLog: () => [...queryKeys.user.all, 'activityLog'] as const,
    storageUsage: () => [...queryKeys.user.all, 'storageUsage'] as const,
    apiUsage: (period: string) => [...queryKeys.user.all, 'apiUsage', period] as const,
  },
  
  // Billing
  billing: {
    all: ['billing'] as const,
    plans: () => [...queryKeys.billing.all, 'plans'] as const,
    subscription: () => [...queryKeys.billing.all, 'subscription'] as const,
    history: () => [...queryKeys.billing.all, 'history'] as const,
    upcomingInvoice: () => [...queryKeys.billing.all, 'upcomingInvoice'] as const,
    paymentMethods: () => [...queryKeys.billing.all, 'paymentMethods'] as const,
    usage: () => [...queryKeys.billing.all, 'usage'] as const,
  },
} as const

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate all queries for a specific entity
  invalidateEntity: (entity: keyof typeof queryKeys) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys[entity].all })
  },
  
  // Remove all queries for a specific entity
  removeEntity: (entity: keyof typeof queryKeys) => {
    return queryClient.removeQueries({ queryKey: queryKeys[entity].all })
  },
  
  // Update cached data
  updateCache: <T>(queryKey: readonly unknown[], updater: (oldData: T | undefined) => T) => {
    queryClient.setQueryData(queryKey, updater)
  },
  
  // Get cached data
  getCache: <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey)
  },
  
  // Prefetch query
  prefetch: (queryKey: readonly unknown[], queryFn: () => Promise<unknown>) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
    })
  },
  
  // Optimistic update helper
  optimisticUpdate: async <T>(
    queryKey: readonly unknown[],
    updater: (oldData: T | undefined) => T,
    mutationFn: () => Promise<unknown>
  ) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey })
    
    // Snapshot the previous value
    const previousData = queryClient.getQueryData<T>(queryKey)
    
    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, updater)
    
    try {
      // Perform the mutation
      const result = await mutationFn()
      return result
    } catch (error) {
      // If the mutation fails, rollback
      queryClient.setQueryData(queryKey, previousData)
      throw error
    }
  },
}

// Error handling utilities
export const queryErrorUtils = {
  // Check if error is a specific type
  isApiError: (error: unknown): error is ApiError => error instanceof ApiError,
  isNetworkError: (error: unknown): error is NetworkError => error instanceof NetworkError,
  
  // Get user-friendly error message
  getErrorMessage: (error: unknown): string => {
    if (error instanceof ApiError) {
      return error.message
    }
    
    if (error instanceof NetworkError) {
      return error.message
    }
    
    if (error instanceof Error) {
      return error.message
    }
    
    return ERROR_MESSAGES.SERVER_ERROR
  },
  
  // Check if error should trigger logout
  shouldLogout: (error: unknown): boolean => {
    return error instanceof ApiError && error.status === 401
  },
}

// React Query devtools configuration
export const devtoolsConfig = {
  initialIsOpen: false
}
