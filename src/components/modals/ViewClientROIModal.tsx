import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { TrendingUp, Clock, DollarSign, Target } from 'lucide-react'
import type { Client } from '../../types'

interface ViewClientROIModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
}

export const ViewClientROIModal: React.FC<ViewClientROIModalProps> = ({
  isOpen,
  onClose,
  client
}) => {
  if (!client) return null

  const valueReclaimed = client.hoursReclaimed * client.hourlyValue
  const vaCost = client.vaHoursWorked * 30 // Assuming $30/hr VA cost
  const netSavings = valueReclaimed - vaCost

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client ROI Details"
      size="md"
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Client Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-2xl">
            {client.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-black">{client.name}</h3>
            <p className="text-gray-600">{client.company}</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">{client.industry}</p>
              <Badge status={client.status} />
            </div>
          </div>
        </div>

        {/* ROI Overview */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-gray-600">Return on Investment</span>
            </div>
            <span className="text-3xl font-bold text-success">{client.roi}%</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Hours Reclaimed</span>
            </div>
            <p className="text-2xl font-bold text-black">{client.hoursReclaimed}h</p>
            <p className="text-xs text-gray-500 mt-1">
              Baseline: {client.baselineHours}h/week
            </p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">Hourly Value</span>
            </div>
            <p className="text-2xl font-bold text-black">${client.hourlyValue}/hr</p>
            <p className="text-xs text-gray-500 mt-1">{client.jobTitle}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-gray-500">VA Hours Worked</span>
            </div>
            <p className="text-2xl font-bold text-black">{client.vaHoursWorked}h</p>
            <p className="text-xs text-gray-500 mt-1">Cost: ${vaCost.toLocaleString()}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Value Reclaimed</span>
            </div>
            <p className="text-2xl font-bold text-black">${valueReclaimed.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Net: ${netSavings.toLocaleString()}</p>
          </div>
        </div>

        {/* ROI Calculation Breakdown */}
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-3">ROI Calculation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Hours Reclaimed:</span>
              <span className="font-semibold text-black">{client.hoursReclaimed}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client Hourly Value:</span>
              <span className="font-semibold text-black">${client.hourlyValue}/hr</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-600">Total Value Reclaimed:</span>
              <span className="font-bold text-success">${valueReclaimed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VA Hours Worked:</span>
              <span className="font-semibold text-black">{client.vaHoursWorked}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VA Cost ($30/hr):</span>
              <span className="font-semibold text-black">${vaCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-600">Net Savings:</span>
              <span className="font-bold text-success">${netSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
              <span className="font-semibold text-black">ROI:</span>
              <span className="font-bold text-success text-lg">{client.roi}%</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p><span className="font-semibold">Location:</span> {client.location}</p>
          <p className="mt-1"><span className="font-semibold">Email:</span> {client.email}</p>
        </div>
      </div>
    </Modal>
  )
}
