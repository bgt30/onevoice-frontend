import { httpClient } from '@/lib/http-client'
import {
  PricingPlan,
  Subscription,
  SubscribeRequest,
  SubscribeResponse,
} from '@/types/api'

export class BillingService {
  /**
   * Get available pricing plans
   */
  static async getPricingPlans(): Promise<PricingPlan[]> {
    return httpClient.get<PricingPlan[]>('billing/plans')
  }

  /**
   * Get current subscription
   */
  static async getCurrentSubscription(): Promise<Subscription> {
    return httpClient.get<Subscription>('billing/subscription')
  }

  /**
   * Subscribe to a plan
   */
  static async subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
    return httpClient.post<SubscribeResponse>('billing/subscribe', data)
  }

  /**
   * Update subscription plan
   */
  static async updateSubscription(planId: string): Promise<Subscription> {
    return httpClient.put<Subscription>('billing/subscription', { planId: planId })
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(cancelAtPeriodEnd = true): Promise<Subscription> {
    return httpClient.post<Subscription>('billing/subscription/cancel', {
      cancelAtPeriodEnd: cancelAtPeriodEnd,
    })
  }

  /**
   * Resume cancelled subscription
   */
  static async resumeSubscription(): Promise<Subscription> {
    return httpClient.post<Subscription>('billing/subscription/resume')
  }

  /**
   * Get billing history
   */
  static async getBillingHistory(page = 1, perPage = 20): Promise<{
    items: Array<{
      id: string
      amount: number
      currency: string
      status: string
      description: string
      invoiceUrl?: string
      createdAt: string
    }>
    total: number
    page: number
    perPage: number
    pages: number
  }> {
    return httpClient.get(`billing/history?page=${page}&perPage=${perPage}`)
  }

  /**
   * Get upcoming invoice
   */
  static async getUpcomingInvoice(): Promise<{
    amount: number
    currency: string
    periodStart: string
    periodEnd: string
    items: Array<{
      description: string
      amount: number
      quantity: number
    }>
  }> {
    return httpClient.get('billing/upcoming-invoice')
  }

  /**
   * Update payment method
   */
  static async updatePaymentMethod(paymentMethodId: string): Promise<{ message: string }> {
    return httpClient.put('billing/payment-method', {
      paymentMethodId: paymentMethodId,
    })
  }

  /**
   * Get payment methods
   */
  static async getPaymentMethods(): Promise<Array<{
    id: string
    type: string
    last4?: string
    brand?: string
    exp_month?: number
    exp_year?: number
    is_default: boolean
  }>> {
    return httpClient.get('billing/payment-methods')
  }

  /**
   * Delete payment method
   */
  static async deletePaymentMethod(paymentMethodId: string): Promise<{ message: string }> {
    return httpClient.delete(`billing/payment-methods/${paymentMethodId}`)
  }

  /**
   * Create setup intent for adding payment method
   */
  static async createSetupIntent(): Promise<{ client_secret: string }> {
    return httpClient.post('billing/setup-intent')
  }

  /**
   * Apply coupon code
   */
  static async applyCoupon(couponCode: string): Promise<{
    message: string
    discount: {
      amount: number
      percentage?: number
      duration: string
    }
  }> {
    return httpClient.post('billing/coupon', { coupon_code: couponCode })
  }

  /**
   * Remove coupon
   */
  static async removeCoupon(): Promise<{ message: string }> {
    return httpClient.delete('billing/coupon')
  }

  /**
   * Download invoice
   */
  static async downloadInvoice(invoiceId: string): Promise<{ download_url: string }> {
    return httpClient.get(`billing/invoices/${invoiceId}/download`)
  }

  /**
   * Get tax information
   */
  static async getTaxInfo(): Promise<{
    tax_id?: string
    tax_exempt: boolean
    tax_rate: number
    country: string
    state?: string
  }> {
    return httpClient.get('billing/tax-info')
  }

  /**
   * Update tax information
   */
  static async updateTaxInfo(data: {
    tax_id?: string
    country: string
    state?: string
  }): Promise<{ message: string }> {
    return httpClient.put('billing/tax-info', data)
  }

  /**
   * Get billing address
   */
  static async getBillingAddress(): Promise<{
    line1: string
    line2?: string
    city: string
    state?: string
    postal_code: string
    country: string
  }> {
    return httpClient.get('billing/address')
  }

  /**
   * Update billing address
   */
  static async updateBillingAddress(address: {
    line1: string
    line2?: string
    city: string
    state?: string
    postal_code: string
    country: string
  }): Promise<{ message: string }> {
    return httpClient.put('billing/address', address)
  }

  /**
   * Get subscription usage for current period
   */
  static async getUsageStats(): Promise<{
    period_start: string
    period_end: string
    credits_used: number
    credits_limit: number | 'unlimited'
    videos_processed: number
    storage_used: number
    api_requests: number
  }> {
    return httpClient.get('billing/usage')
  }

  /**
   * Preview subscription change
   */
  static async previewSubscriptionChange(planId: string): Promise<{
    immediate_charge: number
    proration_amount: number
    new_amount: number
    effective_date: string
  }> {
    return httpClient.post('billing/preview-change', { plan_id: planId })
  }
}
