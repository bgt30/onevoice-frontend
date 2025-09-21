import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/services/auth.service'
import { queryKeys } from '@/lib/query-client'
import { useAuth } from '@/contexts/auth-context'
import {
  LoginRequest,
  SignupRequest,
  ResetPasswordRequest
} from '@/types/api'

// Check email availability
export function useCheckEmailAvailability() {
  return useMutation({
    mutationFn: (email: string) => AuthService.checkEmailAvailability(email),
  })
}

// Validate reset token
export function useValidateResetToken() {
  return useMutation({
    mutationFn: (token: string) => AuthService.validateResetToken(token),
  })
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  const { login } = useAuth()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (response, credentials) => {
      // Update auth user in cache
      queryClient.setQueryData(queryKeys.auth.user, response.user)

      // Call auth context login method with the same credentials
      login(credentials).catch(console.error)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Signup mutation
export function useSignup() {
  const queryClient = useQueryClient()
  const { signup } = useAuth()

  return useMutation({
    mutationFn: (userData: SignupRequest) => AuthService.signup(userData),
    onSuccess: (_, userData) => {
      // Clear auth cache on signup
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })

      // Call auth context signup method
      signup(userData).catch(console.error)
    },
    onError: (error) => {
      console.error('Signup failed:', error)
    },
  })
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient()
  const { logout } = useAuth()

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.clear()

      // Call auth context logout method
      logout()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Even if server logout fails, clear local state
      queryClient.clear()
      logout()
    },
  })
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (refreshToken: string) => AuthService.refreshToken(refreshToken),
    onSuccess: () => {
      // Token refresh succeeded - user data should already be cached
      // No need to update user data as refresh token doesn't return user info
    },
    onError: (error) => {
      console.error('Token refresh failed:', error)
      // Clear auth cache on token refresh failure
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
    },
  })
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  })
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
  })
}

// Verify email mutation
export function useVerifyEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => AuthService.verifyEmail(token),
    onSuccess: () => {
      // Invalidate auth user to refresh profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
    },
  })
}

// Resend verification mutation
export function useResendVerification() {
  return useMutation({
    mutationFn: () => AuthService.resendVerification(),
  })
}

// Get current user query
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => AuthService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if unauthorized
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Combined auth hook that works with auth context
export function useAuthActions() {
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth()

  const loginMutation = useLogin()
  const signupMutation = useSignup()
  const logoutMutation = useLogout()
  const refreshMutation = useRefreshToken()

  return {
    // State
    isAuthenticated,
    isLoading: authLoading,
    user: authUser,

    // Mutations
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    refreshToken: refreshMutation.mutate,

    // Mutation states
    loginState: loginMutation,
    signupState: signupMutation,
    logoutState: logoutMutation,
    refreshState: refreshMutation,

    // Utility functions
    clearAuthCache: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
    },

    refreshUserData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
    },
  }
}
