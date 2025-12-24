import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'
import { FormSelect } from '../common/FormSelect'
import type { Client } from '../../types'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (client: Partial<Client>) => void
  client?: Client
  mode: 'create' | 'edit'
}

const industryOptions = [
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Other', label: 'Other' }
]

const jobTitleOptions = [
  { value: 'CEO', label: 'CEO' },
  { value: 'Real Estate Agent', label: 'Real Estate Agent' },
  { value: 'Healthcare Administrator', label: 'Healthcare Administrator' },
  { value: 'Financial Advisor', label: 'Financial Advisor' },
  { value: 'Attorney', label: 'Attorney' },
  { value: 'Consultant', label: 'Consultant' },
  { value: 'Director', label: 'Director' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Other', label: 'Other' }
]

const locationOptions = [
  { value: 'New York, NY', label: 'New York, NY' },
  { value: 'San Francisco, CA', label: 'San Francisco, CA' },
  { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
  { value: 'Chicago, IL', label: 'Chicago, IL' },
  { value: 'Boston, MA', label: 'Boston, MA' },
  { value: 'Denver, CO', label: 'Denver, CO' },
  { value: 'Seattle, WA', label: 'Seattle, WA' },
  { value: 'Austin, TX', label: 'Austin, TX' },
  { value: 'Miami, FL', label: 'Miami, FL' },
  { value: 'Other', label: 'Other' }
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    jobTitle: '',
    location: '',
    hourlyValue: '',
    baselineHours: '',
    status: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        company: client.company,
        industry: client.industry,
        jobTitle: client.jobTitle,
        location: client.location,
        hourlyValue: client.hourlyValue.toString(),
        baselineHours: client.baselineHours.toString(),
        status: client.status
      })
    } else {
      setFormData({
        name: '',
        email: '',
        company: '',
        industry: '',
        jobTitle: '',
        location: '',
        hourlyValue: '',
        baselineHours: '',
        status: ''
      })
    }
    setErrors({})
  }, [client, isOpen])

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

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required'
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = 'Job title is required'
    }

    if (!formData.location) {
      newErrors.location = 'Location is required'
    }

    if (!formData.hourlyValue) {
      newErrors.hourlyValue = 'Hourly value is required'
    } else if (isNaN(Number(formData.hourlyValue)) || Number(formData.hourlyValue) <= 0) {
      newErrors.hourlyValue = 'Must be a positive number'
    }

    if (!formData.baselineHours) {
      newErrors.baselineHours = 'Baseline hours is required'
    } else if (isNaN(Number(formData.baselineHours)) || Number(formData.baselineHours) <= 0) {
      newErrors.baselineHours = 'Must be a positive number'
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
      const clientData: Partial<Client> = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        jobTitle: formData.jobTitle,
        location: formData.location,
        hourlyValue: Number(formData.hourlyValue),
        baselineHours: Number(formData.baselineHours),
        status: formData.status as 'active' | 'inactive'
      }
      onSubmit(clientData)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Client' : 'Edit Client'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Create Client' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            placeholder="client@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Company"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            error={errors.company}
            placeholder="Company name"
          />

          <FormSelect
            label="Industry"
            required
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            error={errors.industry}
            options={industryOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Job Title"
            required
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            error={errors.jobTitle}
            options={jobTitleOptions}
          />

          <FormSelect
            label="Location"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            error={errors.location}
            options={locationOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Hourly Value"
            type="number"
            required
            value={formData.hourlyValue}
            onChange={(e) => setFormData({ ...formData, hourlyValue: e.target.value })}
            error={errors.hourlyValue}
            placeholder="0"
          />

          <FormField
            label="Baseline Hours"
            type="number"
            required
            value={formData.baselineHours}
            onChange={(e) => setFormData({ ...formData, baselineHours: e.target.value })}
            error={errors.baselineHours}
            placeholder="0"
          />
        </div>

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
