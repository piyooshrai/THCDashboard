import React, { useState } from 'react'
import { Upload } from 'lucide-react'

interface UploadAreaProps {
  onFileSelect: (files: File[]) => void
  acceptedTypes?: string
  maxSize?: string
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelect,
  acceptedTypes = '.pdf,.docx,.xlsx,.png,.jpg',
  maxSize = '10MB'
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    onFileSelect(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onFileSelect(files)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="p-4 bg-background rounded-full mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Accepted formats: {acceptedTypes} (max {maxSize})
        </p>
        <label className="btn-primary cursor-pointer">
          Choose Files
          <input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}
