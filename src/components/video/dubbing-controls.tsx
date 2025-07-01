"use client"

import * as React from "react"
import { Settings, Volume2, Mic, Languages, Wand2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { VideoProject } from "@/types/video"

interface DubbingControlsProps {
  video: VideoProject
  onSettingsChange?: (settings: any) => void
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
]

const voiceTypes = [
  { id: 'natural', name: 'Natural', description: 'Human-like voice with natural intonation' },
  { id: 'professional', name: 'Professional', description: 'Clear, business-appropriate tone' },
  { id: 'casual', name: 'Casual', description: 'Relaxed, conversational style' },
  { id: 'energetic', name: 'Energetic', description: 'Upbeat and dynamic delivery' },
]

export function DubbingControls({ video, onSettingsChange }: DubbingControlsProps) {
  const [targetLanguage, setTargetLanguage] = React.useState(video.targetLanguage)
  const [voiceType, setVoiceType] = React.useState('natural')
  const [speed, setSpeed] = React.useState([1.0])
  const [pitch, setPitch] = React.useState([1.0])
  const [volume, setVolume] = React.useState([1.0])

  const handleApplyChanges = () => {
    const settings = {
      targetLanguage,
      voiceType,
      speed: speed[0],
      pitch: pitch[0],
      volume: volume[0],
    }
    onSettingsChange?.(settings)
  }

  const canEdit = video.status === 'draft' || video.status === 'completed'

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5" />
            <span>Language Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Original Language
              </label>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{video.originalLanguage}</Badge>
                <span className="text-sm text-gray-500">(Detected)</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Target Language
              </label>
              <Select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={!canEdit}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>Voice Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Voice Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {voiceTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    voiceType === type.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canEdit && setVoiceType(type.id)}
                >
                  <div className="font-medium text-sm">{type.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Speed: {speed[0].toFixed(1)}x
              </label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2.0}
                step={0.1}
                disabled={!canEdit}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>Normal</span>
                <span>2.0x</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pitch: {pitch[0].toFixed(1)}x
              </label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0.5}
                max={2.0}
                step={0.1}
                disabled={!canEdit}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lower</span>
                <span>Normal</span>
                <span>Higher</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Volume: {Math.round(volume[0] * 100)}%
              </label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                min={0}
                max={2.0}
                step={0.1}
                disabled={!canEdit}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {canEdit && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleApplyChanges} className="flex-1">
                <Wand2 className="mr-2 h-4 w-4" />
                Apply Changes
              </Button>
              <Button variant="outline" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Changes will regenerate the dubbed audio. This may take a few minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status Message */}
      {!canEdit && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {video.status === 'processing' 
                  ? 'Video is currently being processed. Settings will be available once complete.'
                  : 'Settings are not available for this video status.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
