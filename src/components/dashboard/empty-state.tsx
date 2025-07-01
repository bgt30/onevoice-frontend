import Link from "next/link"
import { FileVideo, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState() {
  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FileVideo className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-black mb-2">
          No videos yet
        </h3>
        
        <p className="text-gray-500 mb-8 max-w-md">
          Get started by uploading your first video or pasting a YouTube link. 
          Transform your content for global audiences with AI-powered dubbing.
        </p>
        
        <Button asChild size="lg" className="px-8">
          <Link href="/">
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Dubbing
          </Link>
        </Button>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-xs font-semibold">1</span>
            </div>
            <span>Upload video</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-xs font-semibold">2</span>
            </div>
            <span>Choose language</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-xs font-semibold">3</span>
            </div>
            <span>Download result</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
