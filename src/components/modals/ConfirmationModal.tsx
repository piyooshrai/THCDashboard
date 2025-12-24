import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { AlertCircle } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className={isDangerous ? 'bg-error hover:bg-error/90' : ''}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className={`flex gap-4 p-4 rounded-lg ${isDangerous ? 'bg-error/10' : 'bg-primary/10'}`}>
          <div className={`p-2 rounded-lg h-fit ${isDangerous ? 'bg-error/20' : 'bg-primary/20'}`}>
            <AlertCircle className={`w-6 h-6 ${isDangerous ? 'text-error' : 'text-primary'}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
