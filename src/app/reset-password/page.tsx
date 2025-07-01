"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/auth-layout"
import { validateNewPasswordForm, ValidationError } from "@/lib/validation"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = React.useState<ValidationError[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [resetError, setResetError] = React.useState("")
  const [tokenError, setTokenError] = React.useState("")

  // Check token validity on component mount
  React.useEffect(() => {
    if (!token) {
      setTokenError("Invalid or missing reset token. Please request a new password reset.")
    } else if (token === "expired") {
      setTokenError("This reset link has expired. Please request a new password reset.")
    } else if (token === "invalid") {
      setTokenError("This reset link is invalid. Please request a new password reset.")
    }
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field-specific errors when user starts typing
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
    
    if (resetError) {
      setResetError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (tokenError) {
      return
    }
    
    // Validate form
    const validation = validateNewPasswordForm(formData.password, formData.confirmPassword)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    setErrors([])
    setResetError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock password reset logic
      if (token === "fail") {
        setResetError("Failed to reset password. Please try again.")
        return
      }
      
      // Successful password reset
      setIsSuccess(true)
    } catch (error) {
      setResetError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/(?=.*[a-z])/.test(password)) strength++
    if (/(?=.*\d)/.test(password)) strength++
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++

    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been updated"
      >
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          {/* Sign In Button */}
          <div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Sign in to your account
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (tokenError) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="This password reset link is not valid"
      >
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <p className="text-sm text-red-800">{tokenError}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              Request new reset link
            </Button>
            
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reset Error */}
        {resetError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{resetError}</p>
            </div>
          </div>
        )}

        {/* New Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={getFieldError("password") ? "border-red-300 focus:border-red-500 focus:ring-red-500 pr-10" : "pr-10"}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-full rounded ${
                      passwordStrength >= level
                        ? passwordStrength <= 1
                          ? "bg-red-500"
                          : passwordStrength <= 2
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Password strength: {
                  passwordStrength <= 1 ? "Weak" :
                  passwordStrength <= 2 ? "Medium" :
                  passwordStrength >= 3 ? "Strong" : ""
                }
              </p>
            </div>
          )}
          
          {getFieldError("password") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("password")}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={getFieldError("confirmPassword") ? "border-red-300 focus:border-red-500 focus:ring-red-500 pr-10" : "pr-10"}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {getFieldError("confirmPassword") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("confirmPassword")}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Resetting password..." : "Reset password"}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-black hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
