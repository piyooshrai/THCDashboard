import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { Calendar, User, DollarSign, Receipt, ExternalLink, CheckCircle } from 'lucide-react'
import type { Invoice } from '../../types'

interface ViewInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  onEdit?: () => void
}

export const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onEdit
}) => {
  if (!invoice) return null

  const handleOpenPaymentLink = () => {
    if (invoice.zohoPaymentUrl) {
      window.open(invoice.zohoPaymentUrl, '_blank')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice Details"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onEdit && invoice.status !== 'paid' && (
            <Button variant="primary" onClick={onEdit}>
              Edit Invoice
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
          <div className="p-4 bg-primary/10 rounded-lg">
            <Receipt className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary">{invoice.invoiceNumber}</h3>
            <p className="text-gray-600 mt-1">{invoice.clientName}</p>
            <div className="mt-2">
              <Badge status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Amount</span>
            </div>
            <p className="text-2xl font-bold text-black">
              ${invoice.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{invoice.currency}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">Due Date</span>
            </div>
            <p className="font-semibold text-black">{invoice.dueDate}</p>
            {invoice.status === 'overdue' && (
              <p className="text-xs text-error mt-1">Overdue</p>
            )}
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-gray-500">Client</span>
            </div>
            <p className="font-semibold text-black">{invoice.clientName}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Created</span>
            </div>
            <p className="font-semibold text-black">{invoice.createdAt}</p>
          </div>
        </div>

        {/* Payment Status */}
        {invoice.status === 'paid' && invoice.paidAt && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-semibold text-success">Payment Received</p>
                <p className="text-sm text-gray-600">
                  Paid on {new Date(invoice.paidAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Link */}
        {invoice.zohoPaymentUrl && (
          <div className="bg-background rounded-lg p-4">
            <h4 className="font-semibold text-black mb-3">Payment Link</h4>
            <Button
              variant="secondary"
              onClick={handleOpenPaymentLink}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Zoho Payment Link
            </Button>
          </div>
        )}

        {/* Invoice Summary */}
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-3">Invoice Summary</h4>
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
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold text-black">{invoice.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-semibold text-black">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-semibold text-black">Total Amount:</span>
              <span className="font-bold text-primary text-lg">
                ${invoice.amount.toLocaleString()} {invoice.currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
