import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'
import { AlertTriangle } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')

  const handleDelete = () => {
    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    onConfirm()
    setConfirmation('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setConfirmation('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Account"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            className="bg-error hover:bg-error/90"
          >
            Delete Account
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-4 p-4 bg-error/10 rounded-lg">
          <div className="p-2 bg-error/20 rounded-lg h-fit">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
          <div>
            <p className="font-semibold text-error mb-2">Warning: This action is permanent</p>
            <p className="text-sm text-gray-600">
              Deleting your account will permanently remove all data including:
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-error mt-0.5">•</span>
            <span>All user accounts, clients, and virtual assistants</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-error mt-0.5">•</span>
            <span>Reports, documents, and uploaded files</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-error mt-0.5">•</span>
            <span>Invoice history and payment records</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-error mt-0.5">•</span>
            <span>ROI metrics and analytics data</span>
          </li>
        </ul>

        <div className="p-4 bg-background rounded-lg">
          <p className="text-sm font-semibold text-black mb-3">
            Type <span className="font-mono text-error">DELETE</span> to confirm:
          </p>
          <FormField
            label=""
            value={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.value)
              setError('')
            }}
            error={error}
            placeholder="Type DELETE"
          />
        </div>

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>
            This action cannot be undone. If you're sure you want to proceed, please type DELETE in the field above.
          </p>
        </div>
      </div>
    </Modal>
  )
}
