import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import {
  DollarSign,
  FileText,
  Users,
  Bell,
  AlertCircle
} from 'lucide-react'
import { mockNotifications } from '../data/mockData'
import type { Notification } from '../types'

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications)

  const handleMarkAllRead = () => {
    console.log('Marking all as read')
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleMarkRead = (id: string) => {
    console.log('Marking notification as read:', id)
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const getNotificationIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      DollarSign,
      FileText,
      Users,
      Bell,
      AlertCircle
    }
    return icons[iconName] || Bell
  }

  const groupNotificationsByTime = () => {
    const today: Notification[] = []
    const yesterday: Notification[] = []
    const thisWeek: Notification[] = []
    const earlier: Notification[] = []

    notifications.forEach((notification) => {
      if (notification.time.includes('minute') || notification.time.includes('hour')) {
        today.push(notification)
      } else if (notification.time.toLowerCase() === 'yesterday') {
        yesterday.push(notification)
      } else if (notification.time.includes('day')) {
        thisWeek.push(notification)
      } else {
        earlier.push(notification)
      }
    })

    return { today, yesterday, thisWeek, earlier }
  }

  const grouped = groupNotificationsByTime()

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const Icon = getNotificationIcon(notification.icon)

    return (
      <div
        onClick={() => !notification.read && handleMarkRead(notification.id)}
        className={`flex gap-4 p-4 rounded-lg transition-all cursor-pointer ${
          notification.read
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
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">{notification.description}</p>
          <p className="text-xs text-gray-400">{notification.time}</p>
        </div>
      </div>
    )
  }

  const NotificationGroup: React.FC<{ title: string; items: Notification[] }> = ({
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
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Header
        title="Notifications"
        subtitle="All system notifications"
        actions={
          <Button variant="secondary" onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        }
      />

      <Card>
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
    </>
  )
}
