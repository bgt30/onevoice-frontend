import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export function AuthLayout({ children, title, subtitle, showBackButton = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Button */}
        {showBackButton && (
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-black">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        )}

        {/* Logo */}
        {/* <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">OV</span>
            </div>
            <span className="text-2xl font-bold text-black">OneVoice</span>
          </Link>
        </div> */}

        {/* Header */}
        <div className="text-center">
          <h2 className="text-h2 text-black">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2025 OneVoice. All rights reserved.
        </p>
      </div>
    </div>
  )
}
