"use client"

import React from 'react'
import { AlertTriangle, Trash2, AlertCircle, Info } from 'lucide-react'
import { Button } from './button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'
import { cn } from '@/lib/utils'

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'default'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmationType
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      // Error handling should be done in the onConfirm function
      console.error('Confirmation action failed:', error)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const getTypeConfig = (type: ConfirmationType) => {
    switch (type) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-red-600',
          confirmVariant: 'destructive' as const,
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          confirmVariant: 'default' as const,
        }
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          confirmVariant: 'default' as const,
        }
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-gray-600',
          confirmVariant: 'default' as const,
        }
    }
  }

  const config = getTypeConfig(type)
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn('flex-shrink-0', config.iconColor)}>
              <Icon className="h-6 w-6" />
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left pl-9">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Convenience hook for confirmation dialogs
export function useConfirmation() {
  const [state, setState] = React.useState<{
    open: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    type?: ConfirmationType
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
  }>({
    open: false,
    title: '',
    description: '',
  })

  const [isLoading, setIsLoading] = React.useState(false)

  const confirm = React.useCallback((options: {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    type?: ConfirmationType
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
  }) => {
    setState({
      open: true,
      ...options,
    })
  }, [])

  const handleConfirm = React.useCallback(async () => {
    if (!state.onConfirm) return

    setIsLoading(true)
    try {
      await state.onConfirm()
      setState(prev => ({ ...prev, open: false }))
    } catch (error) {
      console.error('Confirmation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [state.onConfirm])

  const handleCancel = React.useCallback(() => {
    if (state.onCancel) {
      state.onCancel()
    }
    setState(prev => ({ ...prev, open: false }))
  }, [state.onCancel])

  const ConfirmationComponent = React.useCallback(() => (
    <ConfirmationDialog
      open={state.open}
      onOpenChange={(open) => setState(prev => ({ ...prev, open }))}
      title={state.title}
      description={state.description}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      type={state.type}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ), [state, isLoading, handleConfirm, handleCancel])

  return {
    confirm,
    ConfirmationDialog: ConfirmationComponent,
    isLoading,
  }
}

// Pre-configured confirmation dialogs for common actions
export function useDeleteConfirmation() {
  const { confirm, ConfirmationDialog } = useConfirmation()

  const confirmDelete = React.useCallback((
    itemName: string,
    onConfirm: () => void | Promise<void>
  ) => {
    confirm({
      title: `Delete ${itemName}`,
      description: `Are you sure you want to delete this ${itemName.toLowerCase()}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm,
    })
  }, [confirm])

  return {
    confirmDelete,
    ConfirmationDialog,
  }
}

export function useLogoutConfirmation() {
  const { confirm, ConfirmationDialog } = useConfirmation()

  const confirmLogout = React.useCallback((onConfirm: () => void | Promise<void>) => {
    confirm({
      title: 'Sign Out',
      description: 'Are you sure you want to sign out? You will need to sign in again to access your account.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm,
    })
  }, [confirm])

  return {
    confirmLogout,
    ConfirmationDialog,
  }
}

export function useCancelProcessingConfirmation() {
  const { confirm, ConfirmationDialog } = useConfirmation()

  const confirmCancelProcessing = React.useCallback((onConfirm: () => void | Promise<void>) => {
    confirm({
      title: 'Cancel Processing',
      description: 'Are you sure you want to cancel the video processing? Any progress will be lost.',
      confirmText: 'Cancel Processing',
      cancelText: 'Keep Processing',
      type: 'warning',
      onConfirm,
    })
  }, [confirm])

  return {
    confirmCancelProcessing,
    ConfirmationDialog,
  }
}
