import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VideoService } from '@/services/video.service'
import { queryKeys } from '@/lib/query-client'
import {
  VideoProject,
  VideoListRequest,
  CreateVideoRequest,
  UpdateVideoRequest,
  StartDubbingRequest,
} from '@/types/api'

// Get videos list
export function useVideos(params: VideoListRequest = {}) {
  return useQuery({
    queryKey: queryKeys.videos.list(params as Record<string, unknown>),
    queryFn: () => VideoService.getVideos(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get single video
export function useVideo(videoId: string) {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: () => VideoService.getVideo(videoId),
    enabled: !!videoId,
  })
}

// Get video processing status
export function useVideoStatus(videoId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.videos.status(videoId),
    queryFn: () => VideoService.getProcessingStatus(videoId),
    enabled: enabled && !!videoId,
    refetchInterval: (query) => {
      // Poll every 5 seconds if video is processing
      const data = query.state.data
      if (data?.status === 'processing' || data?.status === 'uploading') {
        return 5000
      }
      return false
    },
  })
}

// Get video analytics
export function useVideoAnalytics(videoId: string) {
  return useQuery({
    queryKey: queryKeys.videos.analytics(videoId),
    queryFn: () => VideoService.getVideoAnalytics(videoId),
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get available languages
export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.videos.languages,
    queryFn: () => VideoService.getAvailableLanguages(),
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

// Get available voices for a language
export function useVoices(languageCode: string) {
  return useQuery({
    queryKey: queryKeys.videos.voices(languageCode),
    queryFn: () => VideoService.getAvailableVoices(languageCode),
    enabled: !!languageCode,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Create video mutation
export function useCreateVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateVideoRequest) => VideoService.createVideo(data),
    onSuccess: () => {
      // Invalidate videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Update video mutation
export function useUpdateVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: UpdateVideoRequest }) =>
      VideoService.updateVideo(videoId, data),
    onSuccess: (updatedVideo) => {
      // Update the specific video in cache
      queryClient.setQueryData(
        queryKeys.videos.detail(updatedVideo.id),
        updatedVideo
      )
      
      // Invalidate videos list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
    },
  })
}

// Delete video mutation
export function useDeleteVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoId: string) => VideoService.deleteVideo(videoId),
    onSuccess: (_, videoId) => {
      // Remove the video from cache
      queryClient.removeQueries({ queryKey: queryKeys.videos.detail(videoId) })
      
      // Invalidate videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Upload video mutation
export function useUploadVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      file, 
      videoId, 
      onProgress 
    }: { 
      file: File
      videoId?: string
      onProgress?: (progress: number) => void 
    }) => VideoService.uploadVideo(file, videoId, onProgress),
    onSuccess: (video) => {
      // Update or set the video in cache
      queryClient.setQueryData(queryKeys.videos.detail(video.id), video)
      
      // Invalidate videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Start dubbing mutation
export function useStartDubbing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: StartDubbingRequest }) =>
      VideoService.startDubbing(videoId, data),
    onSuccess: (_, { videoId }) => {
      // Invalidate video status to start polling
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.status(videoId) })
      
      // Invalidate video details
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(videoId) })
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Cancel processing mutation
export function useCancelProcessing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoId: string) => VideoService.cancelProcessing(videoId),
    onSuccess: (_, videoId) => {
      // Invalidate video status and details
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.status(videoId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(videoId) })
    },
  })
}

// Duplicate video mutation
export function useDuplicateVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoId: string) => VideoService.duplicateVideo(videoId),
    onSuccess: () => {
      // Invalidate videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Generate thumbnail mutation
export function useGenerateThumbnail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ videoId, timestamp }: { videoId: string; timestamp?: number }) =>
      VideoService.generateThumbnail(videoId, timestamp),
    onSuccess: (result, { videoId }) => {
      // Update video in cache with new thumbnail
      const currentVideo = queryClient.getQueryData<VideoProject>(
        queryKeys.videos.detail(videoId)
      )
      
      if (currentVideo) {
        queryClient.setQueryData(
          queryKeys.videos.detail(videoId),
          { ...currentVideo, thumbnailUrl: result.thumbnailUrl }
        )
      }
    },
  })
}

// Preview voice mutation
export function usePreviewVoice() {
  return useMutation({
    mutationFn: ({ voiceId, text }: { voiceId: string; text: string }) =>
      VideoService.previewVoice(voiceId, text),
  })
}

// Share video mutation
export function useShareVideo() {
  return useMutation({
    mutationFn: ({ 
      videoId, 
      options 
    }: { 
      videoId: string
      options?: {
        expiresIn?: number
        password?: string
        allowDownload?: boolean
      }
    }) => VideoService.shareVideo(videoId, options),
  })
}
