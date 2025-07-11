"use client"

import React from 'react'
import { Plus, Search, FileVideo, Upload, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }
  className?: string
}

export function EmptyState({
  icon: Icon = FileVideo,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Pre-configured empty states for common scenarios
export function NoVideosEmptyState({ onCreateVideo }: { onCreateVideo?: () => void }) {
  return (
    <EmptyState
      icon={FileVideo}
      title="No videos yet"
      description="Get started by uploading your first video to begin the dubbing process."
      action={onCreateVideo ? {
        label: 'Upload Video',
        onClick: onCreateVideo,
      } : undefined}
    />
  )
}

export function NoSearchResultsEmptyState({ 
  searchQuery, 
  onClearSearch 
}: { 
  searchQuery: string
  onClearSearch?: () => void 
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={`No videos match "${searchQuery}". Try adjusting your search terms or filters.`}
      action={onClearSearch ? {
        label: 'Clear Search',
        onClick: onClearSearch,
        variant: 'outline',
      } : undefined}
    />
  )
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon={AlertCircle}
      title="No notifications"
      description="You're all caught up! New notifications will appear here."
    />
  )
}

export function UploadEmptyState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={Upload}
      title="Upload your video"
      description="Drag and drop your video file here or click to browse and select a file."
      action={onUpload ? {
        label: 'Choose File',
        onClick: onUpload,
      } : undefined}
    />
  )
}

export function ErrorEmptyState({ 
  title = "Something went wrong",
  description = "We encountered an error loading this content. Please try again.",
  onRetry 
}: { 
  title?: string
  description?: string
  onRetry?: () => void 
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
      } : undefined}
    />
  )
}

// Generic empty state with custom content
export function CustomEmptyState({ 
  children,
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {children}
    </div>
  )
}
