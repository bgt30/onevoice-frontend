// Base API Response Types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  error: string
  message: string
  details?: unknown
  statusCode: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserProfile
}

export interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  acceptTerms: boolean
}

export interface SignupResponse {
  message: string
  user: UserProfile
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
  tokenType: string
  expiresIn: number
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

// User Profile & Account Types
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phone?: string
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ProfileFormData {
  fullName: string
  email: string
  phone: string
}

export interface ProfileFormErrors {
  fullName?: string
  email?: string
  phone?: string
  general?: string
}

export interface ProfileUpdateResponse {
  success: boolean
  message: string
  user?: UserProfile
}

export interface PasswordChangeResponse {
  success: boolean
  message: string
}

export interface AccountDeletionResponse {
  success: boolean
  message: string
}

// Video Project Types
export interface VideoProject {
  id: string
  title: string
  description?: string
  thumbnail: string
  videoUrl?: string
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'draft'
  progress?: number
  createdAt: string
  updatedAt: string
  duration: number
  fileSize: number
  originalLanguage: string
  targetLanguage: string
  voiceSettings?: VoiceSettings
  processingMetadata?: ProcessingMetadata
}

export interface VoiceSettings {
  voiceId: string
  voiceName: string
  speed: number
  pitch: number
  volume: number
  emotion?: string
}

export interface ProcessingMetadata {
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  processingTime?: number
  qualityScore?: number
}

// Video API Request/Response Types
export interface CreateVideoRequest {
  title: string
  description?: string
  originalLanguage: string
  targetLanguage: string
}

export interface UpdateVideoRequest {
  title?: string
  description?: string
  voiceSettings?: Partial<VoiceSettings>
}

export interface VideoListRequest {
  page?: number
  perPage?: number
  status?: string
  search?: string
  sortBy?: 'createdAt' | 'title' | 'duration' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface VideoUploadResponse {
  videoId: string
  uploadUrl: string
  uploadFields?: Record<string, string>
}

export interface StartDubbingRequest {
  targetLanguage: string
  voiceSettings: VoiceSettings
}

export interface StartDubbingResponse {
  jobId: string
  estimatedCompletionTime: number
  message: string
}

export type ViewMode = 'grid' | 'list'
export type SortOption = 'dateCreated' | 'title' | 'duration'
export type FilterStatus = 'all' | 'processing' | 'completed' | 'failed' | 'draft'

// Subscription & Billing Types
export interface Subscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  creditsRemaining: number
  creditsTotal: number | 'unlimited'
  billingAmount: number
  currency: string
  isTrial: boolean
  trialEndsAt?: string
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingPeriod: 'month' | 'year'
  credits: number | 'unlimited'
  features: string[]
  isPopular?: boolean
  isCurrentPlan?: boolean
  stripePriceId?: string
}

export interface SubscribeRequest {
  planId: string
  paymentMethodId?: string
  billingPeriod: 'month' | 'year'
}

export interface SubscribeResponse {
  subscription: Subscription
  clientSecret?: string // For Stripe payment confirmation
  requiresAction?: boolean
}

export interface PricingFeature {
  name: string
  basic: string | boolean | number
  pro: string | boolean | number
  enterprise: string | boolean | number
}

// Credit Usage Types
export interface CreditUsage {
  id: string
  date: Date
  creditsUsed: number
  videoTitle: string
  videoId: string
  operation: 'dubbing' | 'translation' | 'voice_generation'
  details?: string
}

export interface CreditUsageRequest {
  page?: number
  perPage?: number
  startDate?: string
  endDate?: string
  operation?: string
}

// Dashboard & Analytics Types
export interface DashboardStats {
  totalVideos: number
  processing: number
  completed: number
  failed: number
  creditsUsedThisMonth: number
  creditsRemaining: number
  storageUsed: number // in bytes
  storageLimit: number // in bytes
}

export interface VideoAnalytics {
  videoId: string
  views: number
  downloads: number
  shares: number
  averageWatchTime: number
  completionRate: number
  geographicData: Array<{
    country: string
    views: number
  }>
  deviceData: Array<{
    deviceType: string
    views: number
  }>
}

// Language & Voice Types
export interface Language {
  code: string
  name: string
  nativeName: string
  isSupported: boolean
}

export interface Voice {
  id: string
  name: string
  languageCode: string
  gender: 'male' | 'female' | 'neutral'
  ageGroup: 'child' | 'young_adult' | 'adult' | 'senior'
  accent?: string
  sampleUrl?: string
  isPremium: boolean
}

// Notification & Webhook Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export interface NotificationPreferences {
  emailNotifications: boolean
  projectUpdates: boolean
  billingAlerts: boolean
  marketingEmails: boolean
  securityAlerts: boolean
}

export interface WebhookEvent {
  eventType: 'video.processing.started' | 'video.processing.completed' | 'video.processing.failed' | 'subscription.updated'
  data: unknown
  timestamp: string
}

// File Upload Types
export interface FileUploadRequest {
  filename: string
  contentType: string
  fileSize: number
}

export interface FileUploadResponse {
  uploadId: string
  uploadUrl: string
  fields: Record<string, string>
  expiresAt: string
}

// Error & Validation Types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiValidationError extends ApiError {
  details: ValidationError[]
}

