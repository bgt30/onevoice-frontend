"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section')
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-h1 text-black max-w-4xl mx-auto">
              Transform Your Videos for{" "}
              <span className="relative">
                Global Audiences
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-gray-200"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 2 100 2 150 6C200 10 250 4 298 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Value Proposition */}
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed">
                Professional AI-powered video dubbing that preserves emotion and timing. 
                Upload your content and reach viewers worldwide with natural-sounding voice overs 
                in multiple languages.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                No technical expertise required. Studio-quality results in minutes, not hours.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={scrollToUpload}
                className="px-8 py-4 text-base font-semibold"
              >
                Start Dubbing Now
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Trusted by content creators worldwide
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {/* Placeholder for logos/stats */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">50K+</div>
                  <div className="text-sm text-gray-500">Videos Dubbed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">25+</div>
                  <div className="text-sm text-gray-500">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">99%</div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">24/7</div>
                  <div className="text-sm text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-50" />
        </div>
      </div>
    </section>
  )
}
