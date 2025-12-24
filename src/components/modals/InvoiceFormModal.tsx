import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'
import { FormSelect } from '../common/FormSelect'
import { mockClients } from '../../data/mockData'
import type { Invoice } from '../../types'

interface InvoiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (invoice: Partial<Invoice>) => void
  invoice?: Invoice
  mode: 'create' | 'edit'
}

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  invoice,
  mode
}) => {
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    dueDate: '',
    zohoPaymentUrl: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const clientOptions = mockClients
    .filter(c => c.status === 'active')
    .map(c => ({
      value: c.id,
      label: `${c.name} - ${c.company}`
    }))

  useEffect(() => {
    if (invoice) {
      setFormData({
        clientId: invoice.clientId,
        amount: invoice.amount.toString(),
        dueDate: invoice.dueDate,
        zohoPaymentUrl: invoice.zohoPaymentUrl || ''
      })
    } else {
      setFormData({
        clientId: '',
        amount: '',
        dueDate: '',
        zohoPaymentUrl: ''
      })
    }
    setErrors({})
  }, [invoice, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Must be a positive number'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      const invoiceData: Partial<Invoice> = {
        clientId: formData.clientId,
        amount: Number(formData.amount),
        dueDate: formData.dueDate,
        zohoPaymentUrl: formData.zohoPaymentUrl || undefined
      }
      onSubmit(invoiceData)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect
          label="Client"
          required
          value={formData.clientId}
          onChange={(e) => {
            setFormData({ ...formData, clientId: e.target.value })
            setErrors({ ...errors, clientId: '' })
          }}
          error={errors.clientId}
          options={clientOptions}
        />

        <FormField
          label="Amount (USD)"
          type="number"
          required
          value={formData.amount}
          onChange={(e) => {
            setFormData({ ...formData, amount: e.target.value })
            setErrors({ ...errors, amount: '' })
          }}
          error={errors.amount}
          placeholder="0.00"
        />

        <FormField
          label="Due Date"
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => {
            setFormData({ ...formData, dueDate: e.target.value })
            setErrors({ ...errors, dueDate: '' })
          }}
          error={errors.dueDate}
        />

        <FormField
          label="Zoho Payment URL (Optional)"
          type="url"
          value={formData.zohoPaymentUrl}
          onChange={(e) => setFormData({ ...formData, zohoPaymentUrl: e.target.value })}
          placeholder="https://invoice.zoho.com/..."
        />

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>
            {mode === 'create'
              ? 'A unique invoice number will be automatically generated.'
              : 'The invoice number cannot be changed after creation.'}
          </p>
        </div>
      </form>
    </Modal>
  )
}
