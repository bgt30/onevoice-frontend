"use client"

import * as React from "react"
import { User, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile, ProfileFormData, ProfileFormErrors } from "@/types/api"
import { cn } from "@/lib/utils"

interface ProfileFormProps {
  user: UserProfile
  onUpdate: (data: Partial<UserProfile>) => Promise<void>
  isLoading?: boolean
}

// Form validation
const validateProfileForm = (data: ProfileFormData): { isValid: boolean; errors: ProfileFormErrors } => {
  const errors: ProfileFormErrors = {}

  // Full name validation
  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required"
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters"
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email.trim()) {
    errors.email = "Email is required"
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Phone validation (optional)
  if (data.phone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = "Please enter a valid phone number"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function ProfileForm({ user, onUpdate, isLoading = false }: ProfileFormProps) {
  const [formData, setFormData] = React.useState<ProfileFormData>({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || ""
  })
  const [errors, setErrors] = React.useState<ProfileFormErrors>({})
  const [hasChanges, setHasChanges] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  // Check for changes
  React.useEffect(() => {
    const hasFormChanges = 
      formData.fullName !== user.fullName ||
      formData.email !== user.email ||
      formData.phone !== (user.phone || "")
    
    setHasChanges(hasFormChanges)
  }, [formData, user])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear success message
    if (saveSuccess) {
      setSaveSuccess(false)
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateProfileForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      await onUpdate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined
      })
      
      setErrors({})
      setSaveSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setErrors({ general: "Failed to update profile. Please try again." })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={cn(errors.fullName && "border-red-300 focus:border-red-500")}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(errors.email && "border-red-300 focus:border-red-500")}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={cn(errors.phone && "border-red-300 focus:border-red-500")}
              placeholder="Enter your phone number (optional)"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <p className="text-sm text-green-800">Profile updated successfully!</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!hasChanges || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
