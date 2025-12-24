import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FormSelect } from '../common/FormSelect'
import { FormTextArea } from '../common/FormTextArea'
import { Upload } from 'lucide-react'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { files: File[]; clientId?: string; notes?: string }) => void
  clients?: { value: string; label: string }[]
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients = []
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [clientId, setClientId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 10 * 1024 * 1024 // 10MB

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`)
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)
    setError('')
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file')
      return
    }

    onSubmit({
      files: selectedFiles,
      clientId: clientId || undefined,
      notes: notes || undefined
    })

    setSelectedFiles([])
    setClientId('')
    setNotes('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setSelectedFiles([])
    setClientId('')
    setNotes('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Document"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Upload
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Files
            <span className="text-error ml-1">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Accepted: PDF, DOCX, XLSX, PNG, JPG (max 10MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
              Choose Files
            </label>
          </div>
          {error && <p className="mt-2 text-sm text-error">{error}</p>}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected files ({selectedFiles.length}):
              </p>
              <ul className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {clients.length > 0 && (
          <FormSelect
            label="Assign to Client (Optional)"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            options={clients}
          />
        )}

        <FormTextArea
          label="Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this document..."
        />
      </div>
    </Modal>
  )
}
