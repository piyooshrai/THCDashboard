import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { CheckCircle } from 'lucide-react'
import type { Invoice } from '../../types'

interface MarkAsPaidModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  invoice: Invoice | null
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  invoice
}) => {
  if (!invoice) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Invoice as Paid"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Mark as Paid
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-4 p-4 bg-success/10 rounded-lg">
          <div className="p-2 bg-success/20 rounded-lg h-fit">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="font-semibold text-success mb-2">Confirm Payment Received</p>
            <p className="text-sm text-gray-600">
              Mark this invoice as paid to update its status in the system.
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-3">Invoice Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-semibold text-black">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span>
              <span className="font-semibold text-black">{invoice.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-semibold text-black">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-semibold text-black">Amount:</span>
              <span className="font-bold text-primary text-lg">
                ${invoice.amount.toLocaleString()} {invoice.currency}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>
            This will update the invoice status to "Paid" and record the payment date as today.
          </p>
        </div>
      </div>
    </Modal>
  )
}
