import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Button } from '../components/common/Button'
import { UploadArea } from '../components/common/UploadArea'
import { FileText, File, Image, Eye, Download, Trash2 } from 'lucide-react'
import { mockDocuments } from '../data/mockData'
import type { Document } from '../types'

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState(mockDocuments)

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files)
    const newDocs: Document[] = files.map((file, index) => ({
      id: `${documents.length + index + 1}`,
      fileName: file.name,
      fileType: file.name.split('.').pop() || 'unknown',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: 'Admin',
      uploadedByAvatar: 'AD',
      uploadedAt: new Date().toISOString(),
      s3Key: `documents/${Math.random().toString(36).substring(7)}`
    }))
    setDocuments([...newDocs, ...documents])
  }

  const handleDelete = (docId: string) => {
    console.log('Deleting document:', docId)
    setDocuments(documents.filter(d => d.id !== docId))
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
          <div className="flex items-center gap-3">
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
            onClick={() => console.log('View document:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Download document:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
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
    <>
      <Header
        title="Documents"
        subtitle="Manage uploaded files and documents"
        showSearch
        actions={
          <Button variant="primary">Upload Document</Button>
        }
      />

      <Card className="mb-8">
        <h2 className="text-2xl font-bold font-serif text-black mb-6">
          Upload Files
        </h2>
        <UploadArea
          onFileSelect={handleFileUpload}
          acceptedTypes=".pdf,.docx,.xlsx,.png,.jpg"
          maxSize="10MB"
        />
      </Card>

      <Card>
        <h2 className="text-2xl font-bold font-serif text-black mb-6">
          All Documents
        </h2>
        <Table columns={columns} data={documents} />
      </Card>
    </>
  )
}
