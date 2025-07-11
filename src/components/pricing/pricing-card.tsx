"use client"

import * as React from "react"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PricingPlan } from "@/types/api"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  plan: PricingPlan
  onSelect: (planId: string) => void
  isLoading?: boolean
}

export function PricingCard({ plan, onSelect, isLoading = false }: PricingCardProps) {
  const formatPrice = (price: number, currency: string, period: string) => {
    return `$${price}/${period}`
  }

  const formatCredits = (credits: number | 'unlimited') => {
    if (credits === 'unlimited') return 'Unlimited credits'
    return `${credits} credits included`
  }

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group",
        plan.isPopular && "border-black shadow-lg ring-1 ring-black/5",
        plan.isCurrentPlan && "border-gray-900 bg-gray-50/50",
        "cursor-pointer"
      )}
      onClick={() => !plan.isCurrentPlan && !isLoading && onSelect(plan.id)}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-black text-white px-4 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Current Plan Badge */}
      {plan.isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary" className="px-4 py-1">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>
        
        <div className="pt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-black">
              ${plan.price}
            </span>
            <span className="text-gray-500 ml-1">
              /{plan.billingPeriod}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {formatCredits(plan.credits)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4 text-black" />
              </div>
              <span className="text-gray-700 text-sm leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <Button
          className={cn(
            "w-full transition-all duration-200 font-semibold",
            plan.isPopular && "bg-black hover:bg-gray-900 shadow-md hover:shadow-lg",
            plan.isCurrentPlan && "bg-gray-600 hover:bg-gray-700",
            !plan.isPopular && !plan.isCurrentPlan && "bg-black hover:bg-gray-900 group-hover:shadow-md"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(plan.id)
          }}
          disabled={isLoading || plan.isCurrentPlan}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : plan.isCurrentPlan ? (
            "Current Plan"
          ) : (
            "Choose Plan"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
