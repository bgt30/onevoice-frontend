"use client"

import * as React from "react"
import { Zap, TrendingDown, Clock, Video, Languages, Mic } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Subscription, CreditUsage } from "@/types/api"
import { cn } from "@/lib/utils"

interface CreditsMeterProps {
  subscription: Subscription
  usage: CreditUsage[]
}

export function CreditsMeter({ subscription, usage }: CreditsMeterProps) {
  const formatCredits = (credits: number | 'unlimited') => {
    if (credits === 'unlimited') return 'Unlimited'
    return credits.toLocaleString()
  }

  const getUsagePercentage = () => {
    if (subscription.creditsTotal === 'unlimited') return 0
    
    const used = subscription.creditsTotal - subscription.creditsRemaining
    return Math.round((used / subscription.creditsTotal) * 100)
  }

  const getProgressColor = () => {
    const percentage = getUsagePercentage()
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getOperationIcon = (operation: CreditUsage['operation']) => {
    switch (operation) {
      case 'dubbing':
        return <Video className="h-4 w-4" />
      case 'translation':
        return <Languages className="h-4 w-4" />
      case 'voice_generation':
        return <Mic className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getOperationLabel = (operation: CreditUsage['operation']) => {
    switch (operation) {
      case 'dubbing':
        return 'Video Dubbing'
      case 'translation':
        return 'Translation'
      case 'voice_generation':
        return 'Voice Generation'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const totalUsedThisMonth = usage.reduce((total, usage) => total + usage.creditsUsed, 0)
  const usagePercentage = getUsagePercentage()

  return (
    <div className="space-y-6">
      {/* Credits Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Credits Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Credits Remaining */}
          <div className="text-center">
            <div className="text-3xl font-bold text-black">
              {formatCredits(subscription.creditsRemaining)}
            </div>
            <p className="text-sm text-gray-500">
              {subscription.creditsTotal === 'unlimited' 
                ? 'Unlimited credits available'
                : `of ${formatCredits(subscription.creditsTotal)} credits remaining`
              }
            </p>
          </div>

          {/* Progress Bar */}
          {subscription.creditsTotal !== 'unlimited' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Usage</span>
                <span className="font-medium">{usagePercentage}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={usagePercentage} 
                  className="h-2"
                />
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-2 rounded-full transition-all duration-300",
                    getProgressColor()
                  )}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              {usagePercentage >= 75 && (
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  usagePercentage >= 90 ? "text-red-600" : "text-yellow-600"
                )}>
                  <TrendingDown className="h-4 w-4" />
                  {usagePercentage >= 90 
                    ? "Running low on credits"
                    : "Consider upgrading your plan"
                  }
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {totalUsedThisMonth}
              </div>
              <p className="text-xs text-gray-500">Used this month</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {usage.length}
              </div>
              <p className="text-xs text-gray-500">Recent activities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Usage */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usage.length > 0 ? (
            <div className="space-y-3">
              {usage.slice(0, 5).map((usage) => (
                <div key={usage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                      {getOperationIcon(usage.operation)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {usage.videoTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getOperationLabel(usage.operation)} • {formatDate(usage.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 text-sm">
                      -{usage.creditsUsed}
                    </p>
                    <p className="text-xs text-gray-500">credits</p>
                  </div>
                </div>
              ))}
              
              {usage.length > 5 && (
                <div className="text-center pt-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    View all usage history
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No credit usage yet</p>
              <p className="text-sm text-gray-400">
                Start creating videos to see your usage history
              </p>
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Usage Tips */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Credit Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Shorter videos use fewer credits</p>
            <p>• Batch processing saves credits</p>
            <p>• Preview before final generation</p>
            <p>• Use voice presets for efficiency</p>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
