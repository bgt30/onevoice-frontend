import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserService } from '@/services/user.service'
import { queryKeys } from '@/lib/query-client'
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  CreditUsageRequest,
  NotificationPreferences,
} from '@/types/api'

// Get user profile
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => UserService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get user subscription
export function useUserSubscription() {
  return useQuery({
    queryKey: queryKeys.user.subscription(),
    queryFn: () => UserService.getSubscription(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get credit usage
export function useCreditUsage(params: CreditUsageRequest = {}) {
  return useQuery({
    queryKey: queryKeys.user.creditUsage(params),
    queryFn: () => UserService.getCreditUsage(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.user.dashboardStats(),
    queryFn: () => UserService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get notifications
export function useNotifications(page = 1, perPage = 20) {
  return useQuery({
    queryKey: [...queryKeys.user.notifications(), { page, perPage }],
    queryFn: () => UserService.getNotifications(page, perPage),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get notification preferences
export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.user.notificationPreferences(),
    queryFn: () => UserService.getNotificationPreferences(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get activity log
export function useActivityLog(page = 1, perPage = 20) {
  return useQuery({
    queryKey: [...queryKeys.user.activityLog(), { page, perPage }],
    queryFn: () => UserService.getActivityLog(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get storage usage
export function useStorageUsage() {
  return useQuery({
    queryKey: queryKeys.user.storageUsage(),
    queryFn: () => UserService.getStorageUsage(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get API usage
export function useApiUsage(period: 'day' | 'week' | 'month' = 'month') {
  return useQuery({
    queryKey: queryKeys.user.apiUsage(period),
    queryFn: () => UserService.getApiUsage(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => UserService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Update profile in cache
      queryClient.setQueryData(queryKeys.user.profile(), updatedProfile)
      
      // Update auth user if using auth context
      queryClient.setQueryData(queryKeys.auth.user, updatedProfile)
    },
  })
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => UserService.changePassword(data),
  })
}

// Upload avatar mutation
export function useUploadAvatar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (file: File) => UserService.uploadAvatar(file),
    onSuccess: (result) => {
      // Update profile with new avatar URL
      const currentProfile = queryClient.getQueryData(queryKeys.user.profile())
      if (currentProfile) {
        queryClient.setQueryData(queryKeys.user.profile(), {
          ...currentProfile,
          avatarUrl: result.avatarUrl, // Corrected to result.avatarUrl
        })
      }
      
      // Update auth user
      const currentUser = queryClient.getQueryData(queryKeys.auth.user)
      if (currentUser) {
        queryClient.setQueryData(queryKeys.auth.user, {
          ...currentUser,
          avatarUrl: result.avatarUrl, // Corrected to result.avatarUrl
        })
      }
    },
  })
}

// Delete avatar mutation
export function useDeleteAvatar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => UserService.deleteAvatar(),
    onSuccess: () => {
      // Remove avatar URL from profile
      const currentProfile = queryClient.getQueryData(queryKeys.user.profile())
      if (currentProfile) {
        queryClient.setQueryData(queryKeys.user.profile(), {
          ...currentProfile,
          avatarUrl: undefined, 
        })
      }
      
      // Update auth user
      const currentUser = queryClient.getQueryData(queryKeys.auth.user)
      if (currentUser) {
        queryClient.setQueryData(queryKeys.auth.user, {
          ...currentUser,
          avatarUrl: undefined, 
        })
      }
    },
  })
}

// Mark notification as read mutation
export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => UserService.markNotificationRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() })
    },
  })
}

// Mark all notifications as read mutation
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => UserService.markAllNotificationsRead(),
    onSuccess: () => {
      // Invalidate notifications to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() })
    },
  })
}

// Delete notification mutation
export function useDeleteNotification() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => UserService.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate notifications to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() })
    },
  })
}

// Update notification preferences mutation
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      UserService.updateNotificationPreferences(preferences),
    onSuccess: (updatedPreferences) => {
      // Update preferences in cache
      queryClient.setQueryData(queryKeys.user.notificationPreferences(), updatedPreferences)
    },
  })
}

// Enable two-factor authentication mutation
export function useEnableTwoFactor() {
  return useMutation({
    mutationFn: () => UserService.enableTwoFactor(),
  })
}

// Confirm two-factor authentication mutation
export function useConfirmTwoFactor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (code: string) => UserService.confirmTwoFactor(code),
    onSuccess: () => {
      // Invalidate profile to refresh 2FA status
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
    },
  })
}

// Disable two-factor authentication mutation
export function useDisableTwoFactor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (password: string) => UserService.disableTwoFactor(password),
    onSuccess: () => {
      // Invalidate profile to refresh 2FA status
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
    },
  })
}

// Generate backup codes mutation
export function useGenerateBackupCodes() {
  return useMutation({
    mutationFn: () => UserService.generateBackupCodes(),
  })
}

// Export data mutation
export function useExportData() {
  return useMutation({
    mutationFn: () => UserService.exportData(),
  })
}

// Request account deletion mutation
export function useRequestAccountDeletion() {
  return useMutation({
    mutationFn: ({ password, reason }: { password: string; reason?: string }) =>
      UserService.requestAccountDeletion(password, reason),
  })
}

// Cancel account deletion mutation
export function useCancelAccountDeletion() {
  return useMutation({
    mutationFn: () => UserService.cancelAccountDeletion(),
  })
}
