export interface VideoProject {
  id: string
  title: string
  thumbnail: string
  status: 'processing' | 'completed' | 'failed' | 'draft'
  createdAt: Date
  duration: number // in seconds
  originalLanguage: string
  targetLanguage: string
  fileSize: number // in bytes
  description?: string
  progress?: number // 0-100 for processing status
}

export interface DashboardStats {
  totalVideos: number
  processing: number
  completed: number
  failed: number
}

export type ViewMode = 'grid' | 'list'
export type SortOption = 'dateCreated' | 'title' | 'duration'
export type FilterStatus = 'all' | 'processing' | 'completed' | 'failed' | 'draft'
