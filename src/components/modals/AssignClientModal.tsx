import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormSelect } from '../common/FormSelect'
import { mockClients } from '../../data/mockData'
import type { VA } from '../../types'

interface AssignClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (clientId: string) => void
  va: VA | null
}

export const AssignClientModal: React.FC<AssignClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  va
}) => {
  const [selectedClientId, setSelectedClientId] = useState('')
  const [error, setError] = useState('')

  const clientOptions = mockClients
    .filter(c => c.status === 'active')
    .map(c => ({
      value: c.id,
      label: `${c.name} - ${c.company}`
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      setError('Please select a client')
      return
    }

    onSubmit(selectedClientId)
    setSelectedClientId('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setSelectedClientId('')
    setError('')
    onClose()
  }

  if (!va) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Client to VA"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign Client
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-background rounded-lg p-3">
          <p className="text-sm text-gray-600">
            Assigning client to: <span className="font-semibold text-black">{va.name}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Department: {va.department}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Select Client"
            required
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value)
              setError('')
            }}
            error={error}
            options={clientOptions}
          />
        </form>

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>The selected client will be assigned to this VA and will receive notifications about the assignment.</p>
        </div>
      </div>
    </Modal>
  )
}
