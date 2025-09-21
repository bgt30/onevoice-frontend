import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BillingService } from '@/services/billing.service'
import { queryKeys } from '@/lib/query-client'
import {SubscribeRequest} from '@/types/api'

// Get pricing plans
export function usePricingPlans() {
  return useQuery({
    queryKey: queryKeys.billing.plans(),
    queryFn: () => BillingService.getPricingPlans(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Get current subscription
export function useCurrentSubscription() {
  return useQuery({
    queryKey: queryKeys.billing.subscription(),
    queryFn: () => BillingService.getCurrentSubscription(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get billing history
export function useBillingHistory(page = 1, perPage = 20) {
  return useQuery({
    queryKey: [...queryKeys.billing.history(), { page, perPage }],
    queryFn: () => BillingService.getBillingHistory(page, perPage),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get upcoming invoice
export function useUpcomingInvoice() {
  return useQuery({
    queryKey: queryKeys.billing.upcomingInvoice(),
    queryFn: () => BillingService.getUpcomingInvoice(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get payment methods
export function usePaymentMethods() {
  return useQuery({
    queryKey: queryKeys.billing.paymentMethods(),
    queryFn: () => BillingService.getPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get usage statistics
export function useUsageStats() {
  return useQuery({
    queryKey: queryKeys.billing.usage(),
    queryFn: () => BillingService.getUsageStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Subscribe to plan mutation
export function useSubscribe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubscribeRequest) => BillingService.subscribe(data),
    onSuccess: (response) => {
      // Update subscription in cache
      queryClient.setQueryData(queryKeys.billing.subscription(), response.subscription)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.history() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.upcomingInvoice() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.usage() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.subscription() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Update subscription mutation
export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => BillingService.updateSubscription(planId),
    onSuccess: (updatedSubscription) => {
      // Update subscription in cache
      queryClient.setQueryData(queryKeys.billing.subscription(), updatedSubscription)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.history() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.upcomingInvoice() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.usage() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.subscription() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboardStats() })
    },
  })
}

// Cancel subscription mutation
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cancelAtPeriodEnd: boolean) => BillingService.cancelSubscription(cancelAtPeriodEnd),
    onSuccess: (cancelledSubscription) => {
      // Update subscription in cache
      queryClient.setQueryData(queryKeys.billing.subscription(), cancelledSubscription)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.upcomingInvoice() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.subscription() })
    },
  })
}

// Resume subscription mutation
export function useResumeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => BillingService.resumeSubscription(),
    onSuccess: (resumedSubscription) => {
      // Update subscription in cache
      queryClient.setQueryData(queryKeys.billing.subscription(), resumedSubscription)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.upcomingInvoice() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.subscription() })
    },
  })
}

// Update payment method mutation
export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentMethodId: string) => BillingService.updatePaymentMethod(paymentMethodId),
    onSuccess: () => {
      // Invalidate payment methods
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.paymentMethods() })
    },
  })
}

// Delete payment method mutation
export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentMethodId: string) => BillingService.deletePaymentMethod(paymentMethodId),
    onSuccess: () => {
      // Invalidate payment methods
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.paymentMethods() })
    },
  })
}

// Create setup intent mutation
export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: () => BillingService.createSetupIntent(),
  })
}

// Apply coupon mutation
export function useApplyCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (couponCode: string) => BillingService.applyCoupon(couponCode),
    onSuccess: () => {
      // Invalidate subscription and upcoming invoice
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.upcomingInvoice() })
    },
  })
}

// Remove coupon mutation
export function useRemoveCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => BillingService.removeCoupon(),
    onSuccess: () => {
      // Invalidate subscription and upcoming invoice
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.upcomingInvoice() })
    },
  })
}

// Download invoice mutation
export function useDownloadInvoice() {
  return useMutation({
    mutationFn: (invoiceId: string) => BillingService.downloadInvoice(invoiceId),
  })
}

// Get tax information
export function useTaxInfo() {
  return useQuery({
    queryKey: [...queryKeys.billing.all, 'taxInfo'],
    queryFn: () => BillingService.getTaxInfo(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Update tax information mutation
export function useUpdateTaxInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { tax_id?: string; country: string; state?: string }) =>
      BillingService.updateTaxInfo(data),
    onSuccess: () => {
      // Invalidate tax info
      queryClient.invalidateQueries({ queryKey: [...queryKeys.billing.all, 'taxInfo'] })
    },
  })
}

// Get billing address
export function useBillingAddress() {
  return useQuery({
    queryKey: [...queryKeys.billing.all, 'address'],
    queryFn: () => BillingService.getBillingAddress(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Update billing address mutation
export function useUpdateBillingAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (address: {
      line1: string
      line2?: string
      city: string
      state?: string
      postal_code: string
      country: string
    }) => BillingService.updateBillingAddress(address),
    onSuccess: () => {
      // Invalidate billing address
      queryClient.invalidateQueries({ queryKey: [...queryKeys.billing.all, 'address'] })
    },
  })
}

// Preview subscription change mutation
export function usePreviewSubscriptionChange() {
  return useMutation({
    mutationFn: (planId: string) => BillingService.previewSubscriptionChange(planId),
  })
}

// Combined billing hook for common operations
export function useBilling() {
  const queryClient = useQueryClient()

  return {
    // Queries
    pricingPlans: usePricingPlans(),
    currentSubscription: useCurrentSubscription(),
    billingHistory: useBillingHistory(),
    upcomingInvoice: useUpcomingInvoice(),
    paymentMethods: usePaymentMethods(),
    usageStats: useUsageStats(),
    taxInfo: useTaxInfo(),
    billingAddress: useBillingAddress(),

    // Mutations
    subscribe: useSubscribe(),
    updateSubscription: useUpdateSubscription(),
    cancelSubscription: useCancelSubscription(),
    resumeSubscription: useResumeSubscription(),
    updatePaymentMethod: useUpdatePaymentMethod(),
    deletePaymentMethod: useDeletePaymentMethod(),
    createSetupIntent: useCreateSetupIntent(),
    applyCoupon: useApplyCoupon(),
    removeCoupon: useRemoveCoupon(),
    downloadInvoice: useDownloadInvoice(),
    updateTaxInfo: useUpdateTaxInfo(),
    updateBillingAddress: useUpdateBillingAddress(),
    previewSubscriptionChange: usePreviewSubscriptionChange(),

    // Utility functions
    refreshBillingData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.all })
    },

    refreshSubscription: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() })
    },
  }
}
