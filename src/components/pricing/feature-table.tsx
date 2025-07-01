"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { PricingFeature } from "@/types/pricing"
import { cn } from "@/lib/utils"

interface FeatureTableProps {
  features: PricingFeature[]
}

export function FeatureTable({ features }: FeatureTableProps) {
  const renderFeatureValue = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      )
    }
    
    return (
      <span className="text-gray-900 font-medium">
        {value}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  Features
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                >
                  Basic
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-black text-white relative"
                >
                  Pro
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                >
                  Enterprise
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr 
                  key={feature.name}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  )}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {renderFeatureValue(feature.basic)}
                  </td>
                  <td className="px-6 py-4 text-sm text-center bg-gray-50/50">
                    {renderFeatureValue(feature.pro)}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {renderFeatureValue(feature.enterprise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly cards for smaller screens */}
      <div className="md:hidden mt-8 space-y-6">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Swipe left to see all plans on mobile
          </p>
        </div>
        
        {/* Basic Plan Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Basic Plan
          </h3>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={`basic-${feature.name}`} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{feature.name}</span>
                <div className="flex items-center">
                  {renderFeatureValue(feature.basic)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className="bg-black text-white border border-gray-200 rounded-lg p-4 relative">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-4 text-center">
            Pro Plan
          </h3>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={`pro-${feature.name}`} className="flex justify-between items-center">
                <span className="text-sm text-gray-200">{feature.name}</span>
                <div className="flex items-center text-white">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )
                  ) : (
                    <span className="font-medium">{feature.pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Plan Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Enterprise Plan
          </h3>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={`enterprise-${feature.name}`} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{feature.name}</span>
                <div className="flex items-center">
                  {renderFeatureValue(feature.enterprise)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
