import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { DollarSign, FileText, Users, Bell, AlertCircle, Clock } from 'lucide-react'
import type { Notification } from '../../types'

interface ViewNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notification: Notification | null
  onMarkRead?: (id: string) => void
}

export const ViewNotificationModal: React.FC<ViewNotificationModalProps> = ({
  isOpen,
  onClose,
  notification,
  onMarkRead
}) => {
  if (!notification) return null

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

  const Icon = getNotificationIcon(notification.icon)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-accent/10 text-accent border-accent/20'
      case 'report':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'user':
        return 'bg-success/10 text-success border-success/20'
      case 'reminder':
        return 'bg-error/10 text-error border-error/20'
      case 'system':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const handleMarkAsRead = () => {
    if (!notification.read && onMarkRead) {
      onMarkRead(notification.id)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Details"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {!notification.read && onMarkRead && (
            <Button variant="primary" onClick={handleMarkAsRead}>
              Mark as Read
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Notification Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
          <div className={`p-4 rounded-lg ${getTypeColor(notification.type).replace('text-', 'border ')}`}>
            <Icon className={`w-8 h-8 ${getTypeColor(notification.type).split(' ')[1]}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-black">{notification.title}</h3>
              {!notification.read && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                  Unread
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2">{notification.description}</p>
          </div>
        </div>

        {/* Notification Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Type</span>
            </div>
            <p className="font-semibold text-black capitalize">{notification.type}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">Time</span>
            </div>
            <p className="font-semibold text-black">{notification.time}</p>
          </div>
        </div>

        {/* Full Details */}
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-3">Full Details</h4>
          <p className="text-gray-600 leading-relaxed">{notification.description}</p>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>
            <span className="font-semibold">Created:</span> {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </Modal>
  )
}
