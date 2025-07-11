import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { webSocketManager, VideoProcessingUpdate, NotificationUpdate, SubscriptionUpdate } from '@/lib/websocket'
import { queryKeys } from '@/lib/query-client'
import { useToastActions } from '@/components/ui/toast'
import { VideoProject } from '@/types/api'

// Hook for video processing updates
export function useVideoProcessingUpdates() {
  const queryClient = useQueryClient()
  const toast = useToastActions()

  const handleProcessingStarted = useCallback((data: VideoProcessingUpdate) => {
    // Update video status in cache
    const videoQueryKey = queryKeys.videos.detail(data.videoId)
    const currentVideo = queryClient.getQueryData<VideoProject>(videoQueryKey)

    if (currentVideo) {
      queryClient.setQueryData(videoQueryKey, {
        ...currentVideo,
        status: 'processing',
        progress: 0,
      })
    }

    // Invalidate videos list to reflect status change
    queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })

    toast.info('Processing Started', 'Your video is now being processed.')
  }, [queryClient, toast])

  const handleProcessingProgress = useCallback((data: VideoProcessingUpdate) => {
    // Update video progress in cache
    const videoQueryKey = queryKeys.videos.detail(data.videoId)
    const currentVideo = queryClient.getQueryData<VideoProject>(videoQueryKey)

    if (currentVideo) {
      queryClient.setQueryData(videoQueryKey, {
        ...currentVideo,
        status: 'processing',
        progress: data.progress || 0,
      })
    }

    // Update status query
    queryClient.setQueryData(
      queryKeys.videos.status(data.videoId),
      {
        status: 'processing',
        progress: data.progress || 0,
        message: data.message,
      }
    )
  }, [queryClient])

  const handleProcessingCompleted = useCallback((data: VideoProcessingUpdate) => {
    // Update video status in cache
    const videoQueryKey = queryKeys.videos.detail(data.videoId)
    const currentVideo = queryClient.getQueryData<VideoProject>(videoQueryKey)

    if (currentVideo) {
      queryClient.setQueryData(videoQueryKey, {
        ...currentVideo,
        status: 'completed',
        progress: 100,
      })
    }

    // Update status query
    queryClient.setQueryData(
      queryKeys.videos.status(data.videoId),
      {
        status: 'completed',
        progress: 100,
        message: 'Processing completed successfully',
      }
    )

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
    queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })

    toast.success('Processing Complete', 'Your video has been successfully processed and is ready for download.')
  }, [queryClient, toast])

  const handleProcessingFailed = useCallback((data: VideoProcessingUpdate) => {
    // Update video status in cache
    const videoQueryKey = queryKeys.videos.detail(data.videoId)
    const currentVideo = queryClient.getQueryData<VideoProject>(videoQueryKey)
    
    if (currentVideo) {
      queryClient.setQueryData(videoQueryKey, {
        ...currentVideo,
        status: 'failed',
        progress: 0,
      })
    }

    // Update status query
    queryClient.setQueryData(
      queryKeys.videos.status(data.videoId),
      {
        status: 'failed',
        progress: 0,
        message: data.error || 'Processing failed',
      }
    )

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
    queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    
    toast.error('Processing Failed', data.error || 'An error occurred while processing your video.')
  }, [queryClient, toast])

  useEffect(() => {
    const unsubscribeStarted = webSocketManager.on('video.processing.started', handleProcessingStarted)
    const unsubscribeProgress = webSocketManager.on('video.processing.progress', handleProcessingProgress)
    const unsubscribeCompleted = webSocketManager.on('video.processing.completed', handleProcessingCompleted)
    const unsubscribeFailed = webSocketManager.on('video.processing.failed', handleProcessingFailed)

    return () => {
      unsubscribeStarted()
      unsubscribeProgress()
      unsubscribeCompleted()
      unsubscribeFailed()
    }
  }, [handleProcessingStarted, handleProcessingProgress, handleProcessingCompleted, handleProcessingFailed])
}

// Hook for notification updates
export function useNotificationUpdates() {
  const queryClient = useQueryClient()
  const toast = useToastActions()

  const handleNewNotification = useCallback((data: NotificationUpdate) => {
    // Invalidate notifications to fetch the latest
    queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() })
    
    // Show toast notification
    const toastMethod = toast[data.type] || toast.info
    toastMethod(data.title, data.message)
  }, [queryClient, toast])

  useEffect(() => {
    const unsubscribe = webSocketManager.on('notification.new', handleNewNotification)
    return unsubscribe
  }, [handleNewNotification])
}

// Hook for subscription updates
export function useSubscriptionUpdates() {
  const queryClient = useQueryClient()
  const toast = useToastActions()

  const handleSubscriptionUpdate = useCallback((data: SubscriptionUpdate) => {
    // Invalidate subscription queries
    queryClient.invalidateQueries({ queryKey: queryKeys.user.subscription() })
    queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() })
    
    // Show notification for important changes
    if (data.status === 'cancelled') {
      toast.warning('Subscription Cancelled', 'Your subscription has been cancelled.')
    } else if (data.status === 'expired') {
      toast.error('Subscription Expired', 'Your subscription has expired. Please renew to continue using the service.')
    }
  }, [queryClient, toast])

  const handleCreditsUpdate = useCallback((data: { credits_remaining: number }) => {
    // Invalidate credit-related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.user.subscription() })
    queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    
    // Show warning if credits are low
    if (data.credits_remaining <= 10) {
      toast.warning('Low Credits', `You have ${data.credits_remaining} credits remaining.`)
    }
  }, [queryClient, toast])

  useEffect(() => {
    const unsubscribeSubscription = webSocketManager.on('subscription.updated', handleSubscriptionUpdate)
    const unsubscribeCredits = webSocketManager.on('credits.updated', handleCreditsUpdate)

    return () => {
      unsubscribeSubscription()
      unsubscribeCredits()
    }
  }, [handleSubscriptionUpdate, handleCreditsUpdate])
}

// Combined hook for all real-time updates
export function useRealtimeUpdates() {
  useVideoProcessingUpdates()
  useNotificationUpdates()
  useSubscriptionUpdates()
}

// Hook for connection status
export function useWebSocketConnection() {
  const queryClient = useQueryClient()

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    if (isConnected) {
      // Refetch critical data when reconnected
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() })
    }
  }, [queryClient])

  useEffect(() => {
    let wasConnected = webSocketManager.isConnected()

    const checkConnection = () => {
      const isConnected = webSocketManager.isConnected()
      if (isConnected !== wasConnected) {
        handleConnectionChange(isConnected)
        wasConnected = isConnected
      }
    }

    const interval = setInterval(checkConnection, 1000)
    return () => clearInterval(interval)
  }, [handleConnectionChange])

  return {
    isConnected: webSocketManager.isConnected(),
    connectionState: webSocketManager.getConnectionState(),
    reconnect: () => webSocketManager.reconnect(),
  }
}
