import { httpClient } from '@/lib/http-client'
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  Subscription,
  CreditUsage,
  CreditUsageRequest,
  PaginatedResponse,
  DashboardStats,
  NotificationPreferences,
  Notification,
} from '@/types/api'

export class UserService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>('users/profile')
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return httpClient.put<UserProfile>('users/profile', data)
  }

  /**
   * Change user password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return httpClient.put('users/password', data)
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    return httpClient.uploadFile<{ avatarUrl: string }>('users/avatar', file)
  }

  /**
   * Delete user avatar
   */
  static async deleteAvatar(): Promise<{ message: string }> {
    return httpClient.delete('users/avatar')
  }

  /**
   * Get user subscription details
   */
  static async getSubscription(): Promise<Subscription> {
    return httpClient.get<Subscription>('users/subscription')
  }

  /**
   * Get credit usage history
   */
  static async getCreditUsage(params: CreditUsageRequest = {}): Promise<PaginatedResponse<CreditUsage>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `users/credits/usage?${queryString}` : 'users/credits/usage'
    
    return httpClient.get<PaginatedResponse<CreditUsage>>(endpoint)
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    return httpClient.get<DashboardStats>('users/dashboard/stats')
  }

  /**
   * Get user notifications
   */
  static async getNotifications(page = 1, perPage = 20): Promise<PaginatedResponse<Notification>> {
    return httpClient.get<PaginatedResponse<Notification>>(
      `users/notifications?page=${page}&per_page=${perPage}`
    )
  }

  /**
   * Mark notification as read
   */
  static async markNotificationRead(notificationId: string): Promise<{ message: string }> {
    return httpClient.put(`users/notifications/${notificationId}/read`)
  }

  /**
   * Mark all notifications as read
   */
  static async markAllNotificationsRead(): Promise<{ message: string }> {
    return httpClient.put('users/notifications/read-all')
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<{ message: string }> {
    return httpClient.delete(`users/notifications/${notificationId}`)
  }

  /**
   * Get notification preferences
   */
  static async getNotificationPreferences(): Promise<NotificationPreferences> {
    return httpClient.get<NotificationPreferences>('users/notifications/preferences')
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    return httpClient.put<NotificationPreferences>('users/notifications/preferences', preferences)
  }

  /**
   * Enable two-factor authentication
   */
  static async enableTwoFactor(): Promise<{
    qr_code: string
    secret: string
    backup_codes: string[]
  }> {
    return httpClient.post('users/2fa/enable')
  }

  /**
   * Confirm two-factor authentication setup
   */
  static async confirmTwoFactor(code: string): Promise<{ message: string; backup_codes: string[] }> {
    return httpClient.post('users/2fa/confirm', { code })
  }

  /**
   * Disable two-factor authentication
   */
  static async disableTwoFactor(password: string): Promise<{ message: string }> {
    return httpClient.post('users/2fa/disable', { password })
  }

  /**
   * Generate new backup codes for 2FA
   */
  static async generateBackupCodes(): Promise<{ backup_codes: string[] }> {
    return httpClient.post('users/2fa/backup-codes')
  }

  /**
   * Get account activity log
   */
  static async getActivityLog(page = 1, perPage = 20): Promise<PaginatedResponse<{
    id: string
    action: string
    description: string
    ip_address: string
    user_agent: string
    created_at: string
  }>> {
    return httpClient.get(`users/activity?page=${page}&per_page=${perPage}`)
  }

  /**
   * Export user data
   */
  static async exportData(): Promise<{ download_url: string; expires_at: string }> {
    return httpClient.post('users/export')
  }

  /**
   * Request account deletion
   */
  static async requestAccountDeletion(password: string, reason?: string): Promise<{ message: string }> {
    return httpClient.post('users/delete-account', { password, reason })
  }

  /**
   * Cancel account deletion request
   */
  static async cancelAccountDeletion(): Promise<{ message: string }> {
    return httpClient.post('users/cancel-deletion')
  }

  /**
   * Get user storage usage
   */
  static async getStorageUsage(): Promise<{
    used: number
    limit: number
    percentage: number
    breakdown: Array<{
      type: string
      size: number
      count: number
    }>
  }> {
    return httpClient.get('users/storage')
  }

  /**
   * Get user API usage statistics
   */
  static async getApiUsage(period: 'day' | 'week' | 'month' = 'month'): Promise<{
    period: string
    requests: number
    limit: number
    percentage: number
    breakdown: Array<{
      endpoint: string
      requests: number
    }>
  }> {
    return httpClient.get(`users/api-usage?period=${period}`)
  }
}
