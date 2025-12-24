import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Download, FileText, Users, Building2, FileCheck } from 'lucide-react'

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const handleExport = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export All Data"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          This will download a complete copy of all your data in JSON format, including:
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-black">User Data</p>
              <p className="text-sm text-gray-500">All users, clients, and VAs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <FileText className="w-5 h-5 text-accent" />
            <div>
              <p className="font-semibold text-black">Reports & Documents</p>
              <p className="text-sm text-gray-500">All generated reports and uploaded files</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Building2 className="w-5 h-5 text-success" />
            <div>
              <p className="font-semibold text-black">Client Data</p>
              <p className="text-sm text-gray-500">ROI metrics and hours tracked</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <FileCheck className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-black">Invoices</p>
              <p className="text-sm text-gray-500">All invoice records and payment history</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>The export will be saved as <span className="font-mono">thc-data-export.json</span>. This file will contain all your data in a portable format.</p>
        </div>
      </div>
    </Modal>
  )
}
