import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { Star, Users, Clock, TrendingUp } from 'lucide-react'
import type { VA } from '../../types'

interface ViewVAPerformanceModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
  va: VA | null
}

export const ViewVAPerformanceModal: React.FC<ViewVAPerformanceModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  va
}) => {
  if (!va) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="VA Performance Details"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button variant="primary" onClick={onEdit}>
              Edit VA
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* VA Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl">
            {va.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-black">{va.name}</h3>
            <p className="text-gray-600">{va.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">{va.department}</p>
              <Badge status={va.status} />
            </div>
          </div>
        </div>

        {/* Performance Rating */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="text-sm font-medium text-gray-600">Average Rating</span>
            </div>
            <span className="text-3xl font-bold text-accent">{va.avgRating}/5.0</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Active Clients</span>
            </div>
            <p className="text-2xl font-bold text-black">{va.activeClients}</p>
            <p className="text-xs text-gray-500 mt-1">Currently serving</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">Hours This Month</span>
            </div>
            <p className="text-2xl font-bold text-black">{va.hoursThisMonth}h</p>
            <p className="text-xs text-gray-500 mt-1">Total billable hours</p>
          </div>

          <div className="bg-background rounded-lg p-4 col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-gray-500">Performance Summary</span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Client Satisfaction:</span>
                <span className="font-semibold text-success">Excellent</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg Hours per Client:</span>
                <span className="font-semibold text-black">
                  {va.activeClients > 0
                    ? Math.round(va.hoursThisMonth / va.activeClients)
                    : 0}h
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="font-semibold text-black">{va.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-3">Recent Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tasks Completed:</span>
              <span className="font-semibold text-success">247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Response Time:</span>
              <span className="font-semibold text-black">2.3 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quality Score:</span>
              <span className="font-semibold text-success">98%</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
