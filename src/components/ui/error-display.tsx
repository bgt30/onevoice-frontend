"use client"

import React from 'react'
import { AlertCircle, RefreshCw, Wifi, WifiOff, AlertTriangle, XCircle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { ApiError } from '@/lib/http-client'
import { queryErrorUtils } from '@/lib/query-client'

interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
  className?: string
  compact?: boolean
}

export function ErrorDisplay({ error, onRetry, className, compact = false }: ErrorDisplayProps) {
  const errorMessage = queryErrorUtils.getErrorMessage(error)
  const isNetworkError = queryErrorUtils.isNetworkError(error)
  const isApiError = queryErrorUtils.isApiError(error)
  
  // Determine error type and appropriate icon/styling
  const getErrorConfig = () => {
    if (isNetworkError) {
      return {
        icon: WifiOff,
        title: 'Connection Error',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      }
    }
    
    if (isApiError) {
      const apiError = error as ApiError
      
      if (apiError.status === 401 || apiError.status === 403) {
        return {
          icon: AlertTriangle,
          title: 'Authentication Error',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        }
      }
      
      if (apiError.status === 404) {
        return {
          icon: AlertCircle,
          title: 'Not Found',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        }
      }
      
      if (apiError.status >= 500) {
        return {
          icon: XCircle,
          title: 'Server Error',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
      }
    }
    
    // Default error styling
    return {
      icon: AlertCircle,
      title: 'Error',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }
  }
  
  const config = getErrorConfig()
  const Icon = config.icon
  
  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-md border',
        config.bgColor,
        config.borderColor,
        className
      )}>
        <Icon className={cn('h-4 w-4 flex-shrink-0', config.color)} />
        <p className="text-sm text-gray-800 flex-1">{errorMessage}</p>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn(
      'flex items-center justify-center p-8',
      className
    )}>
      <div className="text-center max-w-md">
        <div className="mb-4">
          <Icon className={cn('h-12 w-12 mx-auto', config.color)} />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {isNetworkError && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Please check your internet connection and try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Specific error components for common scenarios
export function NetworkErrorDisplay({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center">
        <WifiOff className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Lost
        </h3>
        <p className="text-gray-600 mb-6">
          Unable to connect to our servers. Please check your internet connection.
        </p>
        {onRetry && (
          <Button onClick={onRetry}>
            <Wifi className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
        )}
      </div>
    </div>
  )
}

export function NotFoundError({ message, onGoBack }: { message?: string; onGoBack?: () => void }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Not Found
        </h3>
        <p className="text-gray-600 mb-6">
          {message || "The resource you're looking for doesn't exist."}
        </p>
        {onGoBack && (
          <Button onClick={onGoBack}>
            Go Back
          </Button>
        )}
      </div>
    </div>
  )
}

export function UnauthorizedError({ onLogin }: { onLogin?: () => void }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access this resource.
        </p>
        {onLogin && (
          <Button onClick={onLogin}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}

// Inline error for form fields
interface InlineErrorProps {
  message: string
  className?: string
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <div className={cn('flex items-center gap-1 text-red-600', className)}>
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span className="text-xs">{message}</span>
    </div>
  )
}

// Toast-style error notification
interface ErrorToastProps {
  error: unknown
  onDismiss: () => void
  onRetry?: () => void
}

export function ErrorToast({ error, onDismiss, onRetry }: ErrorToastProps) {
  const errorMessage = queryErrorUtils.getErrorMessage(error)
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Error</p>
          <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            ×
          </Button>
        </div>
      </div>
    </div>
  )
}
