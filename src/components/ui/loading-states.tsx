"use client"

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-gray-500',
        sizeClasses[size],
        className
      )} 
    />
  )
}

// Full page loading component
interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Section loading component
interface SectionLoadingProps {
  message?: string
  className?: string
}

export function SectionLoading({ message = 'Loading...', className }: SectionLoadingProps) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-2" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Inline loading component
interface InlineLoadingProps {
  message?: string
  size?: 'sm' | 'md'
  className?: string
}

export function InlineLoading({ message, size = 'sm', className }: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LoadingSpinner size={size} />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  )
}

// Button loading state
interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function ButtonLoading({ isLoading, children, loadingText }: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <>
        <LoadingSpinner size="sm" className="mr-2" />
        {loadingText || children}
      </>
    )
  }
  
  return <>{children}</>
}

// Skeleton loading components
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        'animate-pulse bg-gray-200 rounded h-4',
        className
      )} 
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <SkeletonLine className="h-6 w-3/4" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-2/3" />
      <div className="flex space-x-2">
        <SkeletonLine className="h-8 w-20" />
        <SkeletonLine className="h-8 w-16" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} className="h-5" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <SkeletonLine key={colIndex} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Video card skeleton
export function VideoCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <SkeletonLine className="h-5 w-3/4" />
        <SkeletonLine className="h-4 w-full" />
        <div className="flex justify-between items-center">
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}

// Dashboard stats skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <SkeletonLine className="h-4 w-20" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <SkeletonLine className="h-8 w-16 mb-2" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

// Progress loading with percentage
interface ProgressLoadingProps {
  progress: number
  message?: string
  className?: string
}

export function ProgressLoading({ progress, message, className }: ProgressLoadingProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {message && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{message}</span>
          <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}

// Pulsing dot indicator
export function PulsingDot({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  )
}
