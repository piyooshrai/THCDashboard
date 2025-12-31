import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useToast } from '../components/common/Toast'
import { ViewNotificationModal } from '../components/modals/ViewNotificationModal'
import {
  DollarSign,
  FileText,
  Users,
  Bell,
  AlertCircle
} from 'lucide-react'
import { notificationService } from '../services/notificationService'
import type { Notification } from '../types'

export const Notifications: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState<any[]>([])
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null)

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await notificationService.getAll()
      setNotifications(response.notifications)
    } catch (err: any) {
      console.error('Failed to load notifications:', err)
      setError(err.response?.data?.error || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      showToast({ type: 'success', message: 'All notifications marked as read' })

      // Reload notifications list
      await loadNotifications()
    } catch (err: any) {
      console.error('Failed to mark all as read:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to mark all as read' })
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      showToast({ type: 'success', message: 'Notification marked as read' })

      // Reload notifications list
      await loadNotifications()
    } catch (err: any) {
      console.error('Failed to mark as read:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to mark as read' })
    }
  }

  const handleViewNotification = async (notification: any) => {
    setSelectedNotification(notification)
    setIsViewModalOpen(true)

    // Mark as read when viewing
    if (!notification.isRead) {
      await handleMarkRead(notification._id)
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      invoice: DollarSign,
      document: FileText,
      user: Users,
      system: Bell,
      alert: AlertCircle
    }
    return icons[type] || Bell
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notifDate = new Date(timestamp)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return notifDate.toLocaleDateString()
    }
  }

  const groupNotificationsByTime = () => {
    const today: any[] = []
    const yesterday: any[] = []
    const thisWeek: any[] = []
    const earlier: any[] = []

    const now = new Date()

    notifications.forEach((notification) => {
      const notifDate = new Date(notification.createdAt)
      const diffMs = now.getTime() - notifDate.getTime()
      const diffHours = diffMs / 3600000
      const diffDays = diffMs / 86400000

      if (diffHours < 24) {
        today.push(notification)
      } else if (diffDays < 2) {
        yesterday.push(notification)
      } else if (diffDays < 7) {
        thisWeek.push(notification)
      } else {
        earlier.push(notification)
      }
    })

    return { today, yesterday, thisWeek, earlier }
  }

  // Convert API notification to legacy Notification format for modals
  const convertToLegacyNotification = (apiNotif: any | null): Notification | null => {
    if (!apiNotif) return null

    return {
      id: apiNotif._id,
      type: apiNotif.type || 'system',
      icon: apiNotif.type || 'Bell',
      title: apiNotif.title,
      description: apiNotif.message,
      time: getTimeAgo(apiNotif.createdAt),
      read: apiNotif.isRead,
      createdAt: apiNotif.createdAt
    }
  }

  const grouped = groupNotificationsByTime()

  const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type || 'system')

    return (
      <div
        onClick={() => handleViewNotification(notification)}
        className={`flex gap-4 p-4 rounded-lg transition-all cursor-pointer ${
          notification.isRead
            ? 'bg-white hover:bg-background'
            : 'bg-primary/5 hover:bg-primary/10'
        }`}
      >
        <div className="p-3 bg-background rounded-lg h-fit">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <p className="font-semibold text-black">{notification.title}</p>
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
          <p className="text-xs text-gray-400">{getTimeAgo(notification.createdAt)}</p>
        </div>
      </div>
    )
  }

  const NotificationGroup: React.FC<{ title: string; items: any[] }> = ({
    title,
    items
  }) => {
    if (items.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {title}
        </h3>
        <div className="space-y-2">
          {items.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} />
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner message="Loading notifications..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadNotifications} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Notifications"
          subtitle="All system notifications"
          actions={
            <Button variant="secondary" onClick={handleMarkAllRead}>
              Mark All as Read
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Card className="h-full">
          <NotificationGroup title="Today" items={grouped.today} />
          <NotificationGroup title="Yesterday" items={grouped.yesterday} />
          <NotificationGroup title="This Week" items={grouped.thisWeek} />
          <NotificationGroup title="Earlier" items={grouped.earlier} />

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-background rounded-full w-fit mx-auto mb-4">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-black mb-2">No notifications</p>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <ViewNotificationModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedNotification(null)
        }}
        notification={convertToLegacyNotification(selectedNotification)}
        onMarkRead={handleMarkRead}
      />
    </div>
  )
}
