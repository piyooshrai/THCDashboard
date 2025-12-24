import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { AlertTriangle } from 'lucide-react'

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
      size="sm"
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
      <div className="flex gap-4">
        {isDangerous && (
          <div className="p-3 bg-error/10 rounded-lg h-fit">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
        )}
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  )
}
