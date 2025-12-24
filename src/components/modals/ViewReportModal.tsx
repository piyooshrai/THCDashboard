import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { Calendar, User, FileText, Download } from 'lucide-react'
import type { Report } from '../../types'

interface ViewReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: Report | null
}

export const ViewReportModal: React.FC<ViewReportModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  if (!report) return null

  const handleDownload = () => {
    if (report.pdfUrl) {
      window.open(report.pdfUrl, '_blank')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Details"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {report.pdfUrl && (
            <Button variant="primary" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Report Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
          <div className="p-4 bg-primary/10 rounded-lg">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black">{report.name}</h3>
            <p className="text-gray-600 mt-1">{report.clientName}</p>
            <div className="mt-2">
              <Badge status={report.status} />
            </div>
          </div>
        </div>

        {/* Report Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Client</span>
            </div>
            <p className="font-semibold text-black">{report.clientName}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">Report Type</span>
            </div>
            <p className="font-semibold text-black capitalize">{report.type}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-gray-500">Period</span>
            </div>
            <p className="font-semibold text-black text-sm">
              {report.periodStart} - {report.periodEnd}
            </p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Created</span>
            </div>
            <p className="font-semibold text-black">{report.createdAt}</p>
          </div>
        </div>

        {/* Report Summary */}
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-3">Report Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Report Name:</span>
              <span className="font-semibold text-black">{report.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span>
              <span className="font-semibold text-black">{report.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-semibold text-black capitalize">{report.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Period:</span>
              <span className="font-semibold text-black">
                {report.periodStart} - {report.periodEnd}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold text-black">{report.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
