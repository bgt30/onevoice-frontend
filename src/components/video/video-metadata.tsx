import { Clock, Calendar, HardDrive, Languages, FileVideo, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoProject } from "@/types/api"
import { formatDuration, formatDate, formatFileSize } from "@/lib/mock-data"

interface VideoMetadataProps {
  video: VideoProject
}

const getStatusVariant = (status: VideoProject['status']) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'processing'
    case 'failed':
      return 'error'
    case 'draft':
      return 'secondary'
    default:
      return 'default'
  }
}

const getStatusText = (status: VideoProject['status']) => {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'processing':
      return 'Processing'
    case 'failed':
      return 'Failed'
    case 'draft':
      return 'Draft'
    default:
      return status
  }
}

export function VideoMetadata({ video }: VideoMetadataProps) {
  const metadataItems = [
    {
      icon: Clock,
      label: "Duration",
      value: formatDuration(video.duration),
    },
    {
      icon: Calendar,
      label: "Created",
      value: formatDate(video.createdAt),
    },
    {
      icon: HardDrive,
      label: "File Size",
      value: formatFileSize(video.fileSize),
    },
    {
      icon: Languages,
      label: "Languages",
      value: `${video.originalLanguage} → ${video.targetLanguage}`,
    },
    {
      icon: FileVideo,
      label: "Format",
      value: "MP4",
    },
    {
      icon: User,
      label: "Created by",
      value: "You",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Video Information</CardTitle>
          <Badge variant={getStatusVariant(video.status)}>
            {getStatusText(video.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-black mb-2">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-gray-600">{video.description}</p>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metadataItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-black truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress for processing videos */}
        {video.status === 'processing' && video.progress !== undefined && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing Progress</span>
              <span>{video.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${video.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Estimated time remaining: {Math.ceil((100 - video.progress) / 10)} minutes
            </p>
          </div>
        )}

        {/* Error message for failed videos */}
        {video.status === 'failed' && (
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                Processing failed. Please try uploading the video again or contact support if the issue persists.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
