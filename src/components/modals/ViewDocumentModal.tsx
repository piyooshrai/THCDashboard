import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { FileText, File, Image, Download, User, Calendar, HardDrive } from 'lucide-react'
import type { Document } from '../../types'

interface ViewDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document: Document | null
}

export const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  isOpen,
  onClose,
  document
}) => {
  if (!document) return null

  const getFileIcon = (fileType: string) => {
    if (['jpg', 'png', 'jpeg', 'gif'].includes(fileType.toLowerCase())) {
      return Image
    }
    if (['pdf', 'docx', 'doc'].includes(fileType.toLowerCase())) {
      return FileText
    }
    return File
  }

  const Icon = getFileIcon(document.fileType)

  const handleDownload = () => {
    console.log('Downloading document:', document.s3Key)
    // In a real app, this would trigger a download from S3
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Details"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Document Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="p-4 bg-background rounded-lg">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black">{document.fileName}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {document.fileType.toUpperCase()} • {document.size}
            </p>
          </div>
        </div>

        {/* Document Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">Uploaded By</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs">
                {document.uploadedByAvatar}
              </div>
              <span className="font-semibold text-black">{document.uploadedBy}</span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-gray-500">Upload Date</span>
            </div>
            <p className="font-semibold text-black">{document.uploadedAt}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-gray-500">File Type</span>
            </div>
            <p className="font-semibold text-black">{document.fileType.toUpperCase()}</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-500">File Size</span>
            </div>
            <p className="font-semibold text-black">{document.size}</p>
          </div>
        </div>

        {/* Client Info */}
        {document.clientName && (
          <div className="bg-background rounded-lg p-4">
            <h4 className="font-semibold text-black mb-2">Associated Client</h4>
            <p className="text-gray-600">{document.clientName}</p>
          </div>
        )}

        {/* Storage Info */}
        <div className="bg-background rounded-lg p-4">
          <h4 className="font-semibold text-black mb-2">Storage Location</h4>
          <p className="text-xs font-mono text-gray-500 bg-white rounded px-2 py-1 break-all">
            {document.s3Key}
          </p>
        </div>

        {/* File Preview Note */}
        <div className="text-xs text-gray-500 bg-background rounded-lg p-3">
          <p>
            Click the Download button to access this file. File preview functionality will be available in a future update.
          </p>
        </div>
      </div>
    </Modal>
  )
}
