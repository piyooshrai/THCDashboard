import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'
import { FormSelect } from '../common/FormSelect'
import { mockClients } from '../../data/mockData'

interface GenerateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { clientId: string; type: string; periodStart: string; periodEnd: string }) => void
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [clientId, setClientId] = useState('')
  const [reportType, setReportType] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clientOptions = mockClients
    .filter(c => c.status === 'active')
    .map(c => ({
      value: c.id,
      label: `${c.name} - ${c.company}`
    }))

  const reportTypeOptions = [
    { value: 'weekly', label: 'Weekly Report' },
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'custom', label: 'Custom Period Report' }
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!clientId) {
      newErrors.clientId = 'Please select a client'
    }

    if (!reportType) {
      newErrors.reportType = 'Please select a report type'
    }

    if (!periodStart) {
      newErrors.periodStart = 'Start date is required'
    }

    if (!periodEnd) {
      newErrors.periodEnd = 'End date is required'
    }

    if (periodStart && periodEnd && new Date(periodStart) > new Date(periodEnd)) {
      newErrors.periodEnd = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      onSubmit({
        clientId,
        type: reportType,
        periodStart,
        periodEnd
      })
      onClose()
      // Reset form
      setClientId('')
      setReportType('')
      setPeriodStart('')
      setPeriodEnd('')
      setErrors({})
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Report"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Generate Report
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect
          label="Client"
          required
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value)
            setErrors({ ...errors, clientId: '' })
          }}
          error={errors.clientId}
          options={clientOptions}
        />

        <FormSelect
          label="Report Type"
          required
          value={reportType}
          onChange={(e) => {
            setReportType(e.target.value)
            setErrors({ ...errors, reportType: '' })
          }}
          error={errors.reportType}
          options={reportTypeOptions}
        />

        <FormField
          label="Period Start Date"
          type="date"
          required
          value={periodStart}
          onChange={(e) => {
            setPeriodStart(e.target.value)
            setErrors({ ...errors, periodStart: '' })
          }}
          error={errors.periodStart}
        />

        <FormField
          label="Period End Date"
          type="date"
          required
          value={periodEnd}
          onChange={(e) => {
            setPeriodEnd(e.target.value)
            setErrors({ ...errors, periodEnd: '' })
          }}
          error={errors.periodEnd}
        />

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>
            The report will be generated for the selected client and period. You can download it once generated.
          </p>
        </div>
      </form>
    </Modal>
  )
}
