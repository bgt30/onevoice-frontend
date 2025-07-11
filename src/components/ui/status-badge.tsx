"use client"

import React from 'react'
import { CheckCircle, Clock, XCircle, AlertCircle, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusType = 
  | 'completed' 
  | 'processing' 
  | 'failed' 
  | 'draft' 
  | 'uploading'
  | 'pending'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'expired'

interface StatusBadgeProps {
  status: StatusType
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ 
  status, 
  className, 
  showIcon = true, 
  size = 'md' 
}: StatusBadgeProps) {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
        }
      case 'processing':
        return {
          label: 'Processing',
          icon: Loader2,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          animate: true,
        }
      case 'uploading':
        return {
          label: 'Uploading',
          icon: Upload,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
        }
      case 'failed':
        return {
          label: 'Failed',
          icon: XCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
        }
      case 'draft':
        return {
          label: 'Draft',
          icon: Clock,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
        }
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
        }
      case 'active':
        return {
          label: 'Active',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
        }
      case 'inactive':
        return {
          label: 'Inactive',
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
        }
      case 'expired':
        return {
          label: 'Expired',
          icon: XCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
        }
      default:
        return {
          label: status,
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
        }
    }
  }

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
        }
      case 'lg':
        return {
          container: 'px-3 py-2 text-sm',
          icon: 'h-5 w-5',
        }
      default: // md
        return {
          container: 'px-2.5 py-1.5 text-xs',
          icon: 'h-4 w-4',
        }
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = getSizeClasses(size)
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgColor,
        config.textColor,
        sizeClasses.container,
        className
      )}
    >
      {showIcon && (
        <Icon 
          className={cn(
            sizeClasses.icon,
            config.iconColor,
            config.animate && 'animate-spin'
          )} 
        />
      )}
      {config.label}
    </span>
  )
}

// Progress status badge with percentage
interface ProgressStatusBadgeProps {
  progress: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressStatusBadge({ 
  progress, 
  className, 
  size = 'md' 
}: ProgressStatusBadgeProps) {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
        }
      case 'lg':
        return {
          container: 'px-3 py-2 text-sm',
          icon: 'h-5 w-5',
        }
      default: // md
        return {
          container: 'px-2.5 py-1.5 text-xs',
          icon: 'h-4 w-4',
        }
    }
  }

  const sizeClasses = getSizeClasses(size)
  const roundedProgress = Math.round(progress)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        'bg-blue-100 text-blue-800',
        sizeClasses.container,
        className
      )}
    >
      <Loader2 className={cn(sizeClasses.icon, 'text-blue-600 animate-spin')} />
      {roundedProgress}%
    </span>
  )
}

// Subscription status badge
export function SubscriptionStatusBadge({ 
  status,
  className 
}: { 
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due'
  className?: string 
}) {
  const getSubscriptionConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        }
      case 'trial':
        return {
          label: 'Trial',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        }
      case 'expired':
        return {
          label: 'Expired',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        }
      case 'past_due':
        return {
          label: 'Past Due',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        }
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        }
    }
  }

  const config = getSubscriptionConfig(status)

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  )
}

// Priority badge
export function PriorityBadge({ 
  priority,
  className 
}: { 
  priority: 'low' | 'medium' | 'high' | 'urgent'
  className?: string 
}) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Low',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        }
      case 'medium':
        return {
          label: 'Medium',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        }
      case 'high':
        return {
          label: 'High',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
        }
      case 'urgent':
        return {
          label: 'Urgent',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        }
      default:
        return {
          label: priority,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        }
    }
  }

  const config = getPriorityConfig(priority)

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  )
}
