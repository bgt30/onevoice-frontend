import { httpClient } from '@/lib/http-client'
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserProfile,
} from '@/types/api'

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('auth/login', credentials)
  }

  /**
   * Register a new user account
   */
  static async signup(userData: SignupRequest): Promise<SignupResponse> {
    return httpClient.post<SignupResponse>('auth/signup', userData)
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return httpClient.post<RefreshTokenResponse>('auth/refresh', {
      refreshToken: refreshToken,
    })
  }

  /**
   * Initiate password reset process
   */
  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return httpClient.post<ForgotPasswordResponse>('auth/forgot-password', {
      email,
    })
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return httpClient.post<ResetPasswordResponse>('auth/reset-password', data)
  }

  /**
   * Logout user (invalidate tokens on server)
   */
  static async logout(): Promise<void> {
    return httpClient.post('auth/logout')
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return httpClient.post('auth/verify-email', { token })
  }

  /**
   * Resend email verification
   */
  static async resendVerification(): Promise<{ message: string }> {
    return httpClient.post('auth/resend-verification')
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserProfile> {
    return httpClient.get<UserProfile>('users/profile')
  }

  /**
   * Check if email is available for registration
   */
  static async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return httpClient.get(`auth/check-email?email=${encodeURIComponent(email)}`)
  }

  /**
   * Validate reset password token
   */
  static async validateResetToken(token: string): Promise<{ valid: boolean }> {
    return httpClient.get(`auth/validate-reset-token?token=${encodeURIComponent(token)}`)
  }
}
