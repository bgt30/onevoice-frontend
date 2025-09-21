import { httpClient } from '@/lib/http-client'
import {
  VideoProject,
  VideoListRequest,
  PaginatedResponse,
  CreateVideoRequest,
  UpdateVideoRequest,
  VideoUploadResponse,
  StartDubbingRequest,
  StartDubbingResponse,
  VideoAnalytics,
} from '@/types/api'

export class VideoService {
  /**
   * Get paginated list of user's videos
   */
  static async getVideos(params: VideoListRequest = {}): Promise<PaginatedResponse<VideoProject>> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `videos?${queryString}` : 'videos'

    return httpClient.get<PaginatedResponse<VideoProject>>(endpoint)
  }

  /**
   * Get specific video by ID
   */
  static async getVideo(videoId: string): Promise<VideoProject> {
    return httpClient.get<VideoProject>(`videos/${videoId}`)
  }

  /**
   * Create a new video project
   */
  static async createVideo(data: CreateVideoRequest): Promise<VideoProject> {
    return httpClient.post<VideoProject>('videos', data)
  }

  /**
   * Update video metadata
   */
  static async updateVideo(videoId: string, data: UpdateVideoRequest): Promise<VideoProject> {
    return httpClient.put<VideoProject>(`videos/${videoId}`, data)
  }

  /**
   * Delete a video
   */
  static async deleteVideo(videoId: string): Promise<{ message: string }> {
    return httpClient.delete(`videos/${videoId}`)
  }

  /**
   * Get upload URL for video file
   */
  static async getUploadUrl(
    filename: string,
    contentType: string,
    fileSize: number
  ): Promise<VideoUploadResponse> {
    return httpClient.post<VideoUploadResponse>('videos/upload-url', {
      filename,
      contentType: contentType,
      fileSize: fileSize,
    })
  }

  /**
   * Upload video file with progress tracking
   */
  static async uploadVideo(
    file: File,
    videoId?: string,
    onProgress?: (progress: number) => void
  ): Promise<VideoProject> {
    const additionalData = videoId ? { videoId: videoId } : undefined

    return httpClient.uploadFile<VideoProject>(
      'videos/upload',
      file,
      additionalData,
      onProgress
    )
  }

  /**
   * Start dubbing process for a video
   */
  static async startDubbing(
    videoId: string,
    data: StartDubbingRequest
  ): Promise<StartDubbingResponse> {
    return httpClient.post<StartDubbingResponse>(`videos/${videoId}/dub`, data)
  }

  /**
   * Get video processing status
   */
  static async getProcessingStatus(videoId: string): Promise<{
    status: string
    progress: number
    message?: string
    estimated_completion?: string
  }> {
    return httpClient.get(`videos/${videoId}/status`)
  }

  /**
   * Cancel video processing
   */
  static async cancelProcessing(videoId: string): Promise<{ message: string }> {
    return httpClient.post(`videos/${videoId}/cancel`)
  }

  /**
   * Download processed video
   */
  static async getDownloadUrl(videoId: string): Promise<{ download_url: string; expires_at: string }> {
    return httpClient.get(`videos/${videoId}/download`)
  }

  /**
   * Get video analytics
   */
  static async getVideoAnalytics(videoId: string): Promise<VideoAnalytics> {
    return httpClient.get<VideoAnalytics>(`videos/${videoId}/analytics`)
  }

  /**
   * Duplicate a video project
   */
  static async duplicateVideo(videoId: string): Promise<VideoProject> {
    return httpClient.post<VideoProject>(`videos/${videoId}/duplicate`)
  }

  /**
   * Get video thumbnail
   */
  static async generateThumbnail(videoId: string, timestamp?: number): Promise<{ thumbnailUrl: string }> {
    const params = timestamp ? `?timestamp=${timestamp}` : ''
    return httpClient.post(`videos/${videoId}/thumbnail${params}`)
  }

  /**
   * Get available languages for dubbing
   */
  static async getAvailableLanguages(): Promise<Array<{
    code: string
    name: string
    nativeName: string
    isSupported: boolean
  }>> {
    return httpClient.get('videos/languages')
  }

  /**
   * Get available voices for a language
   */
  static async getAvailableVoices(languageCode: string): Promise<Array<{
    id: string
    name: string
    gender: string
    ageGroup: string
    accent?: string
    sampleUrl?: string
    isPremium: boolean
  }>> {
    return httpClient.get(`videos/voices?language=${languageCode}`)
  }

  /**
   * Preview voice with sample text
   */
  static async previewVoice(
    voiceId: string,
    text: string
  ): Promise<{ audio_url: string; expires_at: string }> {
    return httpClient.post('videos/voice-preview', {
      voice_id: voiceId,
      text,
    })
  }

  /**
   * Get video processing history
   */
  static async getProcessingHistory(videoId: string): Promise<Array<{
    id: string
    status: string
    started_at: string
    completed_at?: string
    error_message?: string
    settings: unknown
  }>> {
    return httpClient.get(`videos/${videoId}/history`)
  }

  /**
   * Restore video from a previous version
   */
  static async restoreVersion(videoId: string, versionId: string): Promise<VideoProject> {
    return httpClient.post(`videos/${videoId}/restore/${versionId}`)
  }

  /**
   * Share video (generate shareable link)
   */
  static async shareVideo(
    videoId: string,
    options: {
      expiresIn?: number // seconds
      password?: string
      allowDownload?: boolean
    } = {}
  ): Promise<{ shareUrl: string; expiresAt?: string }> {
    return httpClient.post(`videos/${videoId}/share`, options)
  }

  /**
   * Get shared video (public endpoint)
   */
  static async getSharedVideo(shareToken: string, password?: string): Promise<{
    video: Partial<VideoProject>
    canDownload: boolean
  }> {
    const data = password ? { password } : undefined
    return httpClient.post(`videos/shared/${shareToken}`, data)
  }
}
