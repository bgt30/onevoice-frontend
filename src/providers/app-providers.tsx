"use client"

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from '@/contexts/auth-context'
import { ToastProvider } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/ui/error-boundary'

import { queryClient, devtoolsConfig } from '@/lib/query-client'
import { useRealtimeUpdates } from '@/hooks/use-realtime-updates'

// Component to initialize real-time updates
function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useRealtimeUpdates()
  return <>{children}</>
}

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <RealtimeProvider>
              {children}
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools {...devtoolsConfig} />
              )}
            </RealtimeProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
