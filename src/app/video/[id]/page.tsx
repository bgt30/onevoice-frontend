"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  Trash2,
  MoreVertical,
  Copy,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/video/video-player"
import { VideoMetadata } from "@/components/video/video-metadata"
import { DubbingControls } from "@/components/video/dubbing-controls"
import { mockVideoProjects } from "@/lib/mock-data"

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string

  // Find the video by ID
  const video = mockVideoProjects.find(v => v.id === videoId)

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showShareDialog, setShowShareDialog] = React.useState(false)

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">Video Not Found</h1>
          <p className="text-gray-600 mb-6">The video you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    // In a real app, this would call an API
    console.log('Deleting video:', video.id)
    setShowDeleteDialog(false)
    router.push('/dashboard')
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download
    console.log('Downloading video:', video.id)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setShowShareDialog(false)
    // In a real app, you might show a toast notification
  }

  const canDownload = video.status === 'completed'
  const canEdit = video.status === 'draft' || video.status === 'completed'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-h1 text-black">{video.title}</h1>
                <p className="text-gray-600 mt-1">
                  {video.originalLanguage} → {video.targetLanguage}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {canDownload && (
                <Button onClick={handleDownload} className="px-6">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
              
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Video</DialogTitle>
                    <DialogDescription>
                      Share this video with others using the link below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={typeof window !== 'undefined' ? window.location.href : ''}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                    />
                    <Button onClick={handleShare} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* More Actions */}
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer
              title={video.title}
              className="aspect-video w-full"
            />
            
            {/* Quick Actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {canEdit && (
                  <Button variant="outline" size="sm">
                    <Edit3 className="mr-2 h-3 w-3" />
                    Edit Title
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Open in New Tab
                </Button>
              </div>
              
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Video</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &quot;{video.title}&quot;? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="secondary" onClick={handleDelete}>
                      Delete Video
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <VideoMetadata video={video} />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Dubbing Settings</TabsTrigger>
              <TabsTrigger value="history">Version History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="mt-6">
              <DubbingControls 
                video={video} 
                onSettingsChange={(settings) => {
                  console.log('Settings changed:', settings)
                }}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Version History</h3>
                <p className="text-gray-600 mb-4">
                  Track changes and previous versions of your dubbed video.
                </p>
                <p className="text-sm text-gray-500">
                  No previous versions available for this video.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Analytics</h3>
                <p className="text-gray-600 mb-4">
                  View performance metrics and usage statistics.
                </p>
                <p className="text-sm text-gray-500">
                  Analytics will be available once the video is published.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
