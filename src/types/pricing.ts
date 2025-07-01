export interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  billingPeriod: 'month' | 'year'
  description: string
  features: string[]
  credits: number | 'unlimited'
  isPopular?: boolean
  isCurrentPlan?: boolean
}

export interface PricingFeature {
  name: string
  basic: string | boolean | number
  pro: string | boolean | number
  enterprise: string | boolean | number
}
