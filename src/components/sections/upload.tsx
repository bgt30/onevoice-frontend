"use client"

import * as React from "react"
import { Upload as UploadIcon, FileVideo, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UploadState {
  isDragging: boolean
  isUploading: boolean
  uploadProgress: number
  uploadedFile: File | null
  error: string | null
  success: boolean
}

export function Upload() {
  const [state, setState] = React.useState<UploadState>({
    isDragging: false,
    isUploading: false,
    uploadProgress: 0,
    uploadedFile: null,
    error: null,
    success: false,
  })

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setState(prev => ({ ...prev, isDragging: true }))
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setState(prev => ({ ...prev, isDragging: false }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setState(prev => ({ ...prev, isDragging: false }))
    
    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))
    
    if (videoFile) {
      handleFileUpload(videoFile)
    } else {
      setState(prev => ({ ...prev, error: "Please upload a valid video file" }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setState(prev => ({ ...prev, error: "Please upload a valid video file" }))
      return
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: "File size must be less than 100MB" }))
      return
    }

    setState(prev => ({ 
      ...prev, 
      uploadedFile: file, 
      isUploading: true, 
      error: null,
      uploadProgress: 0 
    }))

    // Simulate upload progress
    const interval = setInterval(() => {
      setState(prev => {
        const newProgress = prev.uploadProgress + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          return { 
            ...prev, 
            uploadProgress: 100, 
            isUploading: false, 
            success: true 
          }
        }
        return { ...prev, uploadProgress: newProgress }
      })
    }, 200)
  }

  const resetUpload = () => {
    setState({
      isDragging: false,
      isUploading: false,
      uploadProgress: 0,
      uploadedFile: null,
      error: null,
      success: false,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <section id="upload-section" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2 text-black">Upload Your Video</h2>
          <p className="mt-4 text-lg text-gray-600">
            Upload your video file to get started with dubbing
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* File Upload */}
          <Card>
            <CardContent className="p-8">
              
              {!state.success ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    state.isDragging 
                      ? "border-black bg-gray-50" 
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FileVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your video here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse files
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={state.isUploading}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="text-center p-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload Complete!
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {state.uploadedFile?.name}
                  </p>
                  <Button variant="outline" onClick={resetUpload}>
                    Upload Another
                  </Button>
                </div>
              )}

              {state.isUploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{state.uploadProgress}%</span>
                  </div>
                  <Progress value={state.uploadProgress} />
                </div>
              )}

              <div className="mt-6 text-sm text-gray-500">
                <p className="font-medium mb-2">Supported formats:</p>
                <p>MP4, MOV, AVI, WebM</p>
                <p className="mt-2">Maximum file size: 100MB</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        {/* Success Actions */}
        {state.success && (
          <div className="mt-12 text-center">
            <Button size="lg" className="px-8">
              Start Dubbing Process
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
