"use client"

import * as React from "react"
import Link from "next/link"
import { Play, Clock, FileVideo, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { VideoProject } from "@/types/video"
import { formatDuration, formatDate, formatFileSize } from "@/lib/mock-data"


interface VideoCardProps {
  video: VideoProject
  viewMode: 'grid' | 'list'
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

export function VideoCard({ video, viewMode }: VideoCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-14 bg-gray-100 rounded-md flex items-center justify-center">
                <FileVideo className="h-6 w-6 text-gray-400" />
              </div>
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link href={`/video/${video.id}`}>
                    <h3 className="text-sm font-medium text-black hover:underline truncate">
                      {video.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(video.createdAt)} • {formatFileSize(video.fileSize)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {video.originalLanguage} → {video.targetLanguage}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant={getStatusVariant(video.status)}>
                    {getStatusText(video.status)}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress bar for processing videos */}
              {video.status === 'processing' && video.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Processing...</span>
                    <span>{video.progress}%</span>
                  </div>
                  <Progress value={video.progress} className="h-1" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <FileVideo className="h-12 w-12 text-gray-400" />
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge variant={getStatusVariant(video.status)}>
              {getStatusText(video.status)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Link href={`/video/${video.id}`}>
              <h3 className="text-sm font-medium text-black hover:underline line-clamp-2">
                {video.title}
              </h3>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
            <div>{video.originalLanguage} → {video.targetLanguage}</div>
            <div>{formatFileSize(video.fileSize)}</div>
          </div>

          {/* Progress bar for processing videos */}
          {video.status === 'processing' && video.progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Processing...</span>
                <span>{video.progress}%</span>
              </div>
              <Progress value={video.progress} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
