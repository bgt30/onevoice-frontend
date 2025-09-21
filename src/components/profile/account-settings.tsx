"use client"

import * as React from "react"
import {
  Lock,
  Bell,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NotificationPreferences, PasswordChangeData } from "@/types/api"
import { cn } from "@/lib/utils"

interface AccountSettingsProps {
  notifications: NotificationPreferences
  onNotificationUpdate: (preferences: NotificationPreferences) => Promise<void>
  onPasswordChange: (data: PasswordChangeData) => Promise<void>
  onAccountDelete: () => Promise<void>
}

export function AccountSettings({
  notifications,
  onNotificationUpdate,
  onPasswordChange,
  onAccountDelete
}: AccountSettingsProps) {
  const [passwordData, setPasswordData] = React.useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordErrors, setPasswordErrors] = React.useState<string[]>([])
  const [passwordSuccess, setPasswordSuccess] = React.useState(false)
  const [isChangingPassword, setIsChangingPassword] = React.useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) errors.push("At least 8 characters")
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter")
    if (!/\d/.test(password)) errors.push("One number")
    if (!/[!@#$%^&*]/.test(password)) errors.push("One special character")
    return errors
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors: string[] = []
    
    if (!passwordData.currentPassword) {
      errors.push("Current password is required")
    }
    
    const newPasswordErrors = validatePassword(passwordData.newPassword)
    if (newPasswordErrors.length > 0) {
      errors.push("New password must have: " + newPasswordErrors.join(", "))
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push("New passwords don't match")
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.push("New password must be different from current password")
    }

    if (errors.length > 0) {
      setPasswordErrors(errors)
      return
    }

    setIsChangingPassword(true)
    setPasswordErrors([])
    
    try {
      await onPasswordChange(passwordData)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch {
      setPasswordErrors(["Failed to change password. Please try again."])
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleNotificationToggle = async (key: keyof NotificationPreferences) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    await onNotificationUpdate(updated)
  }

  const handleAccountDelete = async () => {
    if (deleteConfirmation !== "DELETE") return
    
    setIsDeleting(true)
    try {
      await onAccountDelete()
    } catch (error) {
      console.error("Account deletion failed:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Errors */}
            {passwordErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                {passwordErrors.map((error, index) => (
                  <div key={index} className="flex items-center text-sm text-red-800">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                ))}
              </div>
            )}

            {/* Success */}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center text-sm text-green-800">
                  <Check className="h-4 w-4 mr-2" />
                  Password changed successfully!
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full"
            >
              {isChangingPassword ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Changing Password...
                </div>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {key === 'emailNotifications' && 'Email Notifications'}
                  {key === 'projectUpdates' && 'Project Updates'}
                  {key === 'billingAlerts' && 'Billing Alerts'}
                  {key === 'marketingEmails' && 'Marketing Emails'}
                  {key === 'securityAlerts' && 'Security Alerts'}
                </p>
                <p className="text-sm text-gray-500">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'projectUpdates' && 'Get notified when your videos are ready'}
                  {key === 'billingAlerts' && 'Important billing and payment updates'}
                  {key === 'marketingEmails' && 'Product updates and promotional content'}
                  {key === 'securityAlerts' && 'Security-related notifications'}
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle(key as keyof NotificationPreferences)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  value ? "bg-black" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    value ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-500 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      To confirm deletion, type <strong>DELETE</strong> in the box below:
                    </p>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="Type DELETE to confirm"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      variant="outline"
                      onClick={handleAccountDelete}
                      disabled={deleteConfirmation !== "DELETE" || isDeleting}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          Deleting...
                        </div>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
