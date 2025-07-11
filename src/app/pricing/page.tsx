"use client"

import * as React from "react"
import { PricingCard } from "@/components/pricing/pricing-card"
import { FeatureTable } from "@/components/pricing/feature-table"
import { PricingPlan, PricingFeature } from "@/types/api"

// Mock pricing data
const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    currency: "USD",
    billingPeriod: "month",
    description: "Perfect for individuals and small projects",
    features: [
      "Up to 5 videos per month",
      "10 minutes max duration",
      "3 languages available",
      "720p download quality",
      "Email support"
    ],
    credits: 50,
    isPopular: false,
    isCurrentPlan: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    currency: "USD",
    billingPeriod: "month",
    description: "Ideal for content creators and businesses",
    features: [
      "Up to 25 videos per month",
      "60 minutes max duration",
      "15+ languages available",
      "1080p download quality",
      "Priority email support",
      "Custom voice options",
      "Batch processing"
    ],
    credits: 250,
    isPopular: true,
    isCurrentPlan: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    currency: "USD",
    billingPeriod: "month",
    description: "For large teams and enterprise needs",
    features: [
      "Unlimited videos",
      "Unlimited duration",
      "25+ languages available",
      "4K download quality",
      "24/7 phone & email support",
      "Custom voice training",
      "API access",
      "Team collaboration tools",
      "Advanced analytics"
    ],
    credits: "unlimited",
    isPopular: false,
    isCurrentPlan: false
  }
]

const featureComparison: PricingFeature[] = [
  {
    name: "Videos per month",
    basic: "5",
    pro: "25",
    enterprise: "Unlimited"
  },
  {
    name: "Max video duration",
    basic: "10 minutes",
    pro: "60 minutes",
    enterprise: "Unlimited"
  },
  {
    name: "Available languages",
    basic: "3",
    pro: "15+",
    enterprise: "25+"
  },
  {
    name: "Download quality",
    basic: "720p",
    pro: "1080p",
    enterprise: "4K"
  },
  {
    name: "Support",
    basic: "Email",
    pro: "Priority email",
    enterprise: "24/7 phone & email"
  },
  {
    name: "Custom voice options",
    basic: false,
    pro: true,
    enterprise: true
  },
  {
    name: "Batch processing",
    basic: false,
    pro: true,
    enterprise: true
  },
  {
    name: "API access",
    basic: false,
    pro: false,
    enterprise: true
  },
  {
    name: "Team collaboration",
    basic: false,
    pro: false,
    enterprise: true
  },
  {
    name: "Advanced analytics",
    basic: false,
    pro: false,
    enterprise: true
  }
]

export default function PricingPage() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePlanSelect = (planId: string) => {
    setIsLoading(true)
    // TODO: Implement plan selection logic
    console.log('Selected plan:', planId)
    setTimeout(() => setIsLoading(false), 1000) // Simulate API call
  }

  const scrollToComparison = () => {
    const comparisonSection = document.getElementById('feature-comparison')
    if (comparisonSection) {
      comparisonSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Transform your videos for global audiences with our AI-powered dubbing technology.
            Select the plan that fits your needs and start reaching viewers worldwide.
          </p>
          <button
            onClick={scrollToComparison}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-4"
          >
            Compare all features ↓
          </button>
        </div>

        {/* Pricing Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`${plan.isPopular ? 'lg:scale-105 lg:z-10' : ''}`}
            >
              <PricingCard
                plan={plan}
                onSelect={handlePlanSelect}
                isLoading={isLoading}
              />
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div id="feature-comparison" className="mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
              Compare Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <FeatureTable features={featureComparison} />
        </div>

        {/* FAQ or Additional Info Section */}
        <div className="text-center py-12 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-black mb-4">
            Need a custom solution?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact our sales team for enterprise pricing and custom features tailored to your organization's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors">
              Contact Sales
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              View FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
