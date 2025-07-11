"use client"

import * as React from "react"
import { ProfileForm } from "@/components/profile/profile-form"
import { SubscriptionCard } from "@/components/profile/subscription-card"
import { CreditsMeter } from "@/components/profile/credits-meter"
import { AccountSettings } from "@/components/profile/account-settings"
import { UserProfile, Subscription, CreditUsage, NotificationPreferences, PricingPlan } from "@/types/api"

// Mock user data
const mockUserProfile: UserProfile = {
  id: "user-123",
  email: "demo@onevoice.com",
  fullName: "John Doe",
  phone: "+1 (555) 123-4567",
  createdAt: new Date("2024-01-15")
}

const mockSubscription: UserSubscription = {
  id: "sub-456",
  planId: "pro",
  planName: "Pro",
  status: "active",
  creditsRemaining: 180,
  creditsTotal: 250,
  nextBillingDate: new Date("2024-07-30"),
  billingAmount: 29,
  currency: "USD",
  isTrialPeriod: false
}

const mockCreditUsage: CreditUsage[] = [
  {
    id: "usage-1",
    date: new Date("2024-06-28"),
    creditsUsed: 15,
    videoTitle: "Product Demo Video",
    videoId: "video-1",
    operation: "dubbing"
  },
  {
    id: "usage-2", 
    date: new Date("2024-06-25"),
    creditsUsed: 25,
    videoTitle: "Training Module 1",
    videoId: "video-2",
    operation: "translation"
  },
  {
    id: "usage-3",
    date: new Date("2024-06-20"),
    creditsUsed: 10,
    videoTitle: "Marketing Video",
    videoId: "video-3",
    operation: "voice_generation"
  }
]

const mockNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  projectUpdates: true,
  billingAlerts: true,
  marketingEmails: false,
  securityAlerts: true
}

const availablePlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    currency: "USD",
    billingPeriod: "month",
    description: "Perfect for individuals",
    features: [],
    credits: 50
  },
  {
    id: "pro",
    name: "Pro", 
    price: 29,
    currency: "USD",
    billingPeriod: "month",
    description: "Ideal for content creators",
    features: [],
    credits: 250,
    isCurrentPlan: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    currency: "USD", 
    billingPeriod: "month",
    description: "For large teams",
    features: [],
    credits: "unlimited"
  }
]

export default function ProfilePage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [userProfile, setUserProfile] = React.useState<UserProfile>(mockUserProfile)
  const [subscription, setSubscription] = React.useState<UserSubscription>(mockSubscription)
  const [creditUsage, setCreditUsage] = React.useState<CreditUsage[]>(mockCreditUsage)
  const [notifications, setNotifications] = React.useState<NotificationPreferences>(mockNotificationPreferences)

  const handleProfileUpdate = async (profileData: Partial<UserProfile>) => {
    setIsLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUserProfile(prev => ({ ...prev, ...profileData }))
      console.log('Profile updated:', profileData)
    } catch (error) {
      console.error('Profile update failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanChange = async (planId: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement plan change API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Plan changed to:', planId)
    } catch (error) {
      console.error('Plan change failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async (preferences: NotificationPreferences) => {
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setNotifications(preferences)
      console.log('Notifications updated:', preferences)
    } catch (error) {
      console.error('Notification update failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">Profile</h1>
              <p className="text-gray-600 mt-1 sm:mt-2">
                Manage your account settings and subscription
              </p>
            </div>

            {/* Quick Actions */}
            {/* <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userProfile.fullName}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Personal Info & Subscription */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Personal Information */}
            <ProfileForm
              user={userProfile}
              onUpdate={handleProfileUpdate}
              isLoading={isLoading}
            />

            {/* Subscription & Credits */}
            <SubscriptionCard
              subscription={subscription}
              availablePlans={availablePlans}
              onPlanChange={handlePlanChange}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Credits & Settings */}
          <div className="space-y-6 lg:space-y-8">
            {/* Credits Meter */}
            <CreditsMeter
              subscription={subscription}
              creditUsage={creditUsage}
            />

            {/* Account Settings */}
            <AccountSettings
              notifications={notifications}
              onNotificationUpdate={handleNotificationUpdate}
              onPasswordChange={async (passwordData) => {
                console.log('Password change:', passwordData)
              }}
              onAccountDelete={async () => {
                console.log('Account deletion requested')
              }}
            />
          </div>
        </div>

        {/* Mobile-only Quick Stats */}
        {/* <div className="mt-8 xl:hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-semibold text-gray-900">
                {subscription.creditsRemaining === 'unlimited' ? '∞' : subscription.creditsRemaining}
              </div>
              <p className="text-xs text-gray-500">Credits Left</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-semibold text-gray-900">{subscription.planName}</div>
              <p className="text-xs text-gray-500">Current Plan</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-semibold text-gray-900">{creditUsage.length}</div>
              <p className="text-xs text-gray-500">Recent Uses</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-semibold text-gray-900">
                {subscription.status === 'active' ? '✓' : '⚠'}
              </div>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
