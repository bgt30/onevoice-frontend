"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { PricingFeature } from "@/types/api"
import { cn } from "@/lib/utils"

interface FeatureTableProps {
  features: PricingFeature[]
}

// Popular 배지 컴포넌트 - 재사용 가능
const PopularBadge = () => (
  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
    <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
      Popular
    </span>
  </div>
)

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
        <div className="border border-gray-200 rounded-lg mt-3">
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
                  <PopularBadge />
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
    </div>
  )
}
