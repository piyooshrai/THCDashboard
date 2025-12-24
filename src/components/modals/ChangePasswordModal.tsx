import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (passwords: { current: string; new: string }) => void
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!currentPassword) {
      newErrors.current = 'Current password is required'
    }

    if (!newPassword) {
      newErrors.new = 'New password is required'
    } else if (newPassword.length < 8) {
      newErrors.new = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirm = 'Please confirm your new password'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      onSubmit({ current: currentPassword, new: newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({})
      onClose()
    }
  }

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Change Password
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Current Password"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.current}
          placeholder="Enter current password"
        />

        <FormField
          label="New Password"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.new}
          placeholder="Enter new password"
        />

        <FormField
          label="Confirm New Password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirm}
          placeholder="Confirm new password"
        />

        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>Password must be at least 8 characters long.</p>
        </div>
      </form>
    </Modal>
  )
}
