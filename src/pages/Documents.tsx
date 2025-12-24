import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Button } from '../components/common/Button'
import { UploadArea } from '../components/common/UploadArea'
import { useToast } from '../components/common/Toast'
import { UploadDocumentModal } from '../components/modals/UploadDocumentModal'
import { ViewDocumentModal } from '../components/modals/ViewDocumentModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { FileText, File, Image, Eye, Download, Trash2, Upload } from 'lucide-react'
import { mockDocuments } from '../data/mockData'
import type { Document } from '../types'

export const Documents: React.FC = () => {
  const { showToast } = useToast()
  const [documents, setDocuments] = useState(mockDocuments)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null)

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files)
    const newDocs: Document[] = files.map((file, index) => ({
      id: `${documents.length + index + 1}`,
      fileName: file.name,
      fileType: file.name.split('.').pop() || 'unknown',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: 'Admin',
      uploadedByAvatar: 'AD',
      uploadedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      s3Key: `documents/${Math.random().toString(36).substring(7)}`
    }))
    setDocuments([...newDocs, ...documents])
    showToast({ type: 'success', message: `${files.length} file(s) uploaded successfully` })
  }

  const handleDeleteDocument = () => {
    if (!deleteDocId) return
    console.log('Deleting document:', deleteDocId)
    setDocuments(documents.filter(d => d.id !== deleteDocId))
    showToast({ type: 'success', message: 'Document deleted successfully' })
    setDeleteDocId(null)
  }

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setIsViewModalOpen(true)
  }

  const handleDownload = (doc: Document) => {
    console.log('Downloading document:', doc.s3Key)
    showToast({ type: 'info', message: `Downloading ${doc.fileName}...` })
  }

  const getFileIcon = (fileType: string) => {
    if (['jpg', 'png', 'jpeg', 'gif'].includes(fileType.toLowerCase())) {
      return Image
    }
    if (['pdf', 'docx', 'doc'].includes(fileType.toLowerCase())) {
      return FileText
    }
    return File
  }

  const columns = [
    {
      header: 'File Name',
      accessor: (row: Document) => {
        const Icon = getFileIcon(row.fileType)
        return (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleViewDocument(row)}
          >
            <div className="p-2 bg-background rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-black">{row.fileName}</span>
          </div>
        )
      }
    },
    {
      header: 'Uploaded By',
      accessor: (row: Document) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs">
            {row.uploadedByAvatar}
          </div>
          <span className="text-gray-600">{row.uploadedBy}</span>
        </div>
      )
    },
    {
      header: 'Client',
      accessor: (row: Document) => (
        <span className="text-gray-600">{row.clientName || 'N/A'}</span>
      )
    },
    {
      header: 'Size',
      accessor: 'size' as keyof Document,
      className: 'text-gray-600'
    },
    {
      header: 'Upload Date',
      accessor: 'uploadedAt' as keyof Document,
      className: 'text-gray-500'
    },
    {
      header: 'Actions',
      accessor: (row: Document) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewDocument(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteDocId(row.id) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Documents"
          subtitle="Manage uploaded files and documents"
          showSearch
          actions={
            <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Card className="mb-5">
          <h2 className="text-xl font-bold font-serif text-black mb-4">
            Quick Upload
          </h2>
          <UploadArea
            onFileSelect={handleFileUpload}
            acceptedTypes=".pdf,.docx,.xlsx,.png,.jpg"
            maxSize="10MB"
          />
        </Card>

        <Card className="h-[calc(100vh-380px)] flex flex-col">
          <h2 className="text-xl font-bold font-serif text-black mb-4 flex-shrink-0">
            All Documents ({documents.length})
          </h2>
          <div className="flex-1 overflow-y-auto">
            <Table columns={columns} data={documents} />
          </div>
        </Card>
      </div>

      {/* Modals */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={(data) => handleFileUpload(data.files)}
      />

      <ViewDocumentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedDocument(null)
        }}
        document={selectedDocument}
      />

      <ConfirmationModal
        isOpen={deleteDocId !== null}
        onClose={() => setDeleteDocId(null)}
        onConfirm={handleDeleteDocument}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
