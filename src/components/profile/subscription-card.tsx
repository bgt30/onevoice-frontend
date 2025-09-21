"use client"

import * as React from "react"
import Link from "next/link"
import { CreditCard, ArrowUpRight, ArrowDownRight, Star, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Subscription, PricingPlan } from "@/types/api"

interface SubscriptionCardProps {
  subscription: Subscription
  availablePlans: PricingPlan[]
  onPlanChange: (planId: string) => Promise<void>
  isLoading?: boolean
}

export function SubscriptionCard({
  subscription,
  availablePlans,
  onPlanChange,
  isLoading = false
}: SubscriptionCardProps) {
  const [changingToPlan, setChangingToPlan] = React.useState<string | null>(null)

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCredits = (credits: number | 'unlimited') => {
    if (credits === 'unlimited') return 'Unlimited'
    return credits.toLocaleString()
  }

  const getStatusBadge = (status: Subscription['status']) => {
    const variants = {
      active: { variant: 'default' as const, text: 'Active' },
      trial: { variant: 'secondary' as const, text: 'Trial' },
      cancelled: { variant: 'outline' as const, text: 'Cancelled' },
      expired: { variant: 'outline' as const, text: 'Expired' },
      past_due: { variant: 'error' as const, text: 'Past Due' }
    }
    
    const config = variants[status] || variants.active
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'enterprise':
        return <Crown className="h-4 w-4" />
      case 'pro':
        return <Star className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const handlePlanChange = async (planId: string) => {
    if (planId === subscription.planId) return
    
    setChangingToPlan(planId)
    try {
      await onPlanChange(planId)
    } catch (error) {
      console.error('Plan change failed:', error)
    } finally {
      setChangingToPlan(null)
    }
  }

  const getUpgradeDowngradeOptions = () => {
    const currentPlanIndex = availablePlans.findIndex(plan => plan.id === subscription.planId)
    const upgrades = availablePlans.slice(currentPlanIndex + 1)
    const downgrades = availablePlans.slice(0, currentPlanIndex)
    
    return { upgrades, downgrades }
  }

  const { upgrades, downgrades } = getUpgradeDowngradeOptions()
  const currentPlan = availablePlans.find(plan => plan.id === subscription.planId)


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription & Billing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getPlanIcon(subscription.planId)}
              <h3 className="font-semibold text-gray-900">{subscription.planName} Plan</h3>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Credits Remaining</p>
              <p className="font-medium text-gray-900">
                {formatCredits(subscription.creditsRemaining)}
                {subscription.creditsTotal !== 'unlimited' && (
                  <span className="text-gray-500"> / {formatCredits(subscription.creditsTotal)}</span>
                )}
              </p>
            </div>
            
            {subscription.currentPeriodEnd && (
              <div>
                <p className="text-gray-500">Next Billing</p>
                <p className="font-medium text-gray-900">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            )}
            
            {subscription.billingAmount && (
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-medium text-gray-900">
                  ${subscription.billingAmount}/{currentPlan?.billingPeriod}
                </p>
              </div>
            )}
            
            {subscription.isTrial && subscription.trialEndsAt && (
              <div>
                <p className="text-gray-500">Trial Ends</p>
                <p className="font-medium text-orange-600">
                  {formatDate(subscription.trialEndsAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Plan Change Options */}
        {(upgrades.length > 0 || downgrades.length > 0) && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Change Plan</h4>
            <div className="space-y-3">
              {/* Upgrades */}
              {upgrades.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPlanIcon(plan.id)}
                    <div>
                      <p className="font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-500">
                        ${plan.price}/{plan.billingPeriod} • {formatCredits(plan.credits)} credits
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={isLoading || changingToPlan === plan.id}
                    className="flex items-center gap-1"
                  >
                    {changingToPlan === plan.id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                    Upgrade
                  </Button>
                </div>
              ))}

              {/* Downgrades */}
              {downgrades.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPlanIcon(plan.id)}
                    <div>
                      <p className="font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-500">
                        ${plan.price}/{plan.billingPeriod} • {formatCredits(plan.credits)} credits
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={isLoading || changingToPlan === plan.id}
                    className="flex items-center gap-1"
                  >
                    {changingToPlan === plan.id ? (
                      <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    Downgrade
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Plans */}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" asChild className="w-full">
            <Link href="/pricing">
              View All Plans & Features
            </Link>
          </Button>
        </div>

        {/* Billing History */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Billing History</h4>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">June 2024</span>
              <span className="font-medium">$29.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">May 2024</span>
              <span className="font-medium">$29.00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
