import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Button } from '../components/common/Button'
import { UploadArea } from '../components/common/UploadArea'
import { useToast } from '../components/common/Toast'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { UploadDocumentModal } from '../components/modals/UploadDocumentModal'
import { ViewDocumentModal } from '../components/modals/ViewDocumentModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { FileText, File, Image, Eye, Download, Trash2, Upload } from 'lucide-react'
import { documentService, Document as APIDocument } from '../services/documentService'
import { clientService } from '../services/clientService'
import type { Document } from '../types'

export const Documents: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState<APIDocument[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<APIDocument | null>(null)
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null)

  // Load documents on mount
  useEffect(() => {
    loadDocuments()
    loadClients()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await documentService.getAll()
      setDocuments(response.documents)
    } catch (err: any) {
      console.error('Failed to load documents:', err)
      setError(err.response?.data?.error || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const response = await clientService.getAll()
      setClients(response.clients)
    } catch (err) {
      console.error('Failed to load clients:', err)
    }
  }

  const handleFileUpload = async (data: { files: File[]; clientId?: string; notes?: string }) => {
    try {
      for (const file of data.files) {
        await documentService.upload(file, {
          clientId: data.clientId,
          category: 'other',
        })
      }

      showToast({ type: 'success', message: `${data.files.length} file(s) uploaded successfully` })

      // Reload documents list
      await loadDocuments()
      setIsUploadModalOpen(false)
    } catch (err: any) {
      console.error('Failed to upload files:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to upload files' })
    }
  }

  const handleQuickUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        await documentService.upload(file, {
          category: 'other',
        })
      }

      showToast({ type: 'success', message: `${files.length} file(s) uploaded successfully` })

      // Reload documents list
      await loadDocuments()
    } catch (err: any) {
      console.error('Failed to upload files:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to upload files' })
    }
  }

  const handleDeleteDocument = async () => {
    if (!deleteDocId) return

    try {
      await documentService.delete(deleteDocId)
      showToast({ type: 'success', message: 'Document deleted successfully' })

      // Reload documents list
      await loadDocuments()
      setDeleteDocId(null)
    } catch (err: any) {
      console.error('Failed to delete document:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete document' })
    }
  }

  const handleViewDocument = (doc: APIDocument) => {
    setSelectedDocument(doc)
    setIsViewModalOpen(true)
  }

  const handleDownload = async (doc: APIDocument) => {
    try {
      await documentService.download(doc._id)
      showToast({ type: 'success', message: `Downloading ${doc.name}...` })
    } catch (err: any) {
      console.error('Failed to download document:', err)
      showToast({ type: 'error', message: 'Failed to download document' })
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return Image
    }
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) {
      return FileText
    }
    return File
  }

  // Convert API document to legacy Document format for modals
  const convertToLegacyDocument = (apiDoc: APIDocument | null): Document | null => {
    if (!apiDoc) return null

    return {
      id: apiDoc._id,
      fileName: apiDoc.name,
      fileType: apiDoc.mimeType.split('/')[1] || 'unknown',
      size: `${(apiDoc.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: apiDoc.uploadedBy,
      uploadedByAvatar: apiDoc.uploadedBy?.substring(0, 2).toUpperCase() || 'UN',
      uploadedAt: new Date(apiDoc.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      s3Key: apiDoc.s3Key,
      clientName: apiDoc.clientId || undefined
    }
  }

  const clientOptions = clients.map(c => ({
    value: c._id,
    label: c.companyName || `${c.userId}`
  }))

  const columns = [
    {
      header: 'File Name',
      accessor: (row: APIDocument) => {
        const Icon = getFileIcon(row.mimeType)
        return (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleViewDocument(row)}
          >
            <div className="p-2 bg-background rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-black">{row.name}</span>
          </div>
        )
      }
    },
    {
      header: 'Uploaded By',
      accessor: (row: APIDocument) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs">
            {row.uploadedBy?.substring(0, 2).toUpperCase() || 'UN'}
          </div>
          <span className="text-gray-600">{row.uploadedBy || 'Unknown'}</span>
        </div>
      )
    },
    {
      header: 'Client',
      accessor: (row: APIDocument) => (
        <span className="text-gray-600">{row.clientId?.substring(0, 8) || 'N/A'}</span>
      )
    },
    {
      header: 'Size',
      accessor: (row: APIDocument) => (
        <span className="text-gray-600">{(row.size / 1024 / 1024).toFixed(2)} MB</span>
      ),
      className: 'text-gray-600'
    },
    {
      header: 'Upload Date',
      accessor: (row: APIDocument) => (
        <span className="text-gray-500">
          {new Date(row.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      ),
      className: 'text-gray-500'
    },
    {
      header: 'Actions',
      accessor: (row: APIDocument) => (
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
            onClick={(e) => { e.stopPropagation(); setDeleteDocId(row._id) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner message="Loading documents..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDocuments} />
  }

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
            onFileSelect={handleQuickUpload}
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
        onSubmit={handleFileUpload}
        clients={clientOptions}
      />

      <ViewDocumentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedDocument(null)
        }}
        document={convertToLegacyDocument(selectedDocument)}
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
