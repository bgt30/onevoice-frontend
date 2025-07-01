"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/auth-layout"
import { validatePasswordResetForm, ValidationError } from "@/lib/validation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [errors, setErrors] = React.useState<ValidationError[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [resetError, setResetError] = React.useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
    
    if (resetError) {
      setResetError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validation = validatePasswordResetForm(email)
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
      if (email === "nonexistent@example.com") {
        setResetError("No account found with this email address.")
        return
      }
      
      // Successful password reset request
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

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent password reset instructions to your email"
      >
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              We've sent a password reset link to:
            </p>
            <p className="font-medium text-black">{email}</p>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-gray-700 font-medium mb-1">
                  What's next?
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create a new password</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resend Button */}
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsSuccess(false)
                setEmail("")
              }}
              variant="outline"
              className="w-full"
            >
              Send another email
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-black hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
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

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={handleInputChange}
            className={getFieldError("email") ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
            placeholder="Enter your email address"
          />
          {getFieldError("email") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("email")}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending reset link..." : "Send reset link"}
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
