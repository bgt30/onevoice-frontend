import { VideoProject, DashboardStats } from '@/types/api'

export const mockVideoProjects: VideoProject[] = [
  {
    id: '1',
    title: 'Product Demo Video',
    thumbnail: '/api/placeholder/320/180',
    status: 'completed',
    createdAt: new Date('2024-06-25'),
    duration: 180, // 3 minutes
    originalLanguage: 'English',
    targetLanguage: 'Spanish',
    fileSize: 45000000, // 45MB
    description: 'Marketing video for new product launch',
  },
  {
    id: '2',
    title: 'Training Module 1',
    thumbnail: '/api/placeholder/320/180',
    status: 'processing',
    createdAt: new Date('2024-06-28'),
    duration: 420, // 7 minutes
    originalLanguage: 'English',
    targetLanguage: 'French',
    fileSize: 78000000, // 78MB
    description: 'Employee training content',
    progress: 65,
  },
  {
    id: '3',
    title: 'Customer Testimonial',
    thumbnail: '/api/placeholder/320/180',
    status: 'completed',
    createdAt: new Date('2024-06-20'),
    duration: 90, // 1.5 minutes
    originalLanguage: 'English',
    targetLanguage: 'German',
    fileSize: 23000000, // 23MB
    description: 'Client success story video',
  },
  {
    id: '4',
    title: 'Webinar Recording',
    thumbnail: '/api/placeholder/320/180',
    status: 'failed',
    createdAt: new Date('2024-06-22'),
    duration: 3600, // 1 hour
    originalLanguage: 'English',
    targetLanguage: 'Japanese',
    fileSize: 156000000, // 156MB
    description: 'Technical webinar content',
  },
  {
    id: '5',
    title: 'Company Introduction',
    thumbnail: '/api/placeholder/320/180',
    status: 'draft',
    createdAt: new Date('2024-06-29'),
    duration: 240, // 4 minutes
    originalLanguage: 'English',
    targetLanguage: 'Italian',
    fileSize: 52000000, // 52MB
    description: 'Corporate overview video',
  },
  {
    id: '6',
    title: 'Tutorial Series Ep 1',
    thumbnail: '/api/placeholder/320/180',
    status: 'processing',
    createdAt: new Date('2024-06-27'),
    duration: 600, // 10 minutes
    originalLanguage: 'English',
    targetLanguage: 'Portuguese',
    fileSize: 89000000, // 89MB
    description: 'Educational content series',
    progress: 25,
  },
]

export const mockDashboardStats: DashboardStats = {
  totalVideos: mockVideoProjects.length,
  processing: mockVideoProjects.filter(v => v.status === 'processing').length,
  completed: mockVideoProjects.filter(v => v.status === 'completed').length,
  failed: mockVideoProjects.filter(v => v.status === 'failed').length,
}

// Utility functions
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
