import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'
import { FormSelect } from '../common/FormSelect'
import type { VA } from '../../types'

interface VAFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (va: Partial<VA>) => void
  va?: VA
  mode: 'create' | 'edit'
}

const departmentOptions = [
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Operations', label: 'Operations' },
  { value: 'IT', label: 'IT' },
  { value: 'Other', label: 'Other' }
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

export const VAFormModal: React.FC<VAFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  va,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    status: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (va) {
      setFormData({
        name: va.name,
        email: va.email,
        department: va.department,
        status: va.status
      })
    } else {
      setFormData({
        name: '',
        email: '',
        department: '',
        status: ''
      })
    }
    setErrors({})
  }, [va, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.department) {
      newErrors.department = 'Department is required'
    }

    if (!formData.status) {
      newErrors.status = 'Status is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      const vaData: Partial<VA> = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        status: formData.status as 'active' | 'inactive'
      }
      onSubmit(vaData)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Virtual Assistant' : 'Edit Virtual Assistant'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Create VA' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Enter full name"
        />

        <FormField
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="va@example.com"
        />

        <FormSelect
          label="Department"
          required
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          error={errors.department}
          options={departmentOptions}
        />

        <FormSelect
          label="Status"
          required
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          error={errors.status}
          options={statusOptions}
        />
      </form>
    </Modal>
  )
}
