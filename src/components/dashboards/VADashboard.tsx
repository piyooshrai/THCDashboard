import React, { useState, useEffect } from 'react'
import { Header } from '../layout/Header'
import { StatCard } from '../common/StatCard'
import { Card } from '../common/Card'
import { Table } from '../common/Table'
import { Badge } from '../common/Badge'
import { useToast } from '../common/Toast'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorMessage } from '../ErrorMessage'
import {
  Building2,
  Clock,
  CheckCircle,
  FileText,
  Download
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { clientService } from '../../services/clientService'
import { documentService } from '../../services/documentService'

export const VADashboard: React.FC = () => {
  const { showToast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    loadVAData()
  }, [])

  const loadVAData = async () => {
    try {
      setLoading(true)
      setError('')

      const [clientsRes, docsRes] = await Promise.all([
        clientService.getAll({ limit: 10 }),
        documentService.getAll({ limit: 5 })
      ])

      setClients(clientsRes.clients)
      setDocuments(docsRes.documents)
    } catch (err: any) {
      console.error('Failed to load VA data:', err)
      setError(err.response?.data?.error || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = async (docId: string) => {
    try {
      await documentService.download(docId)
    } catch (err: any) {
      showToast({ type: 'error', message: 'Failed to download document' })
    }
  }

  const clientColumns = [
    {
      header: 'Client',
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {row.companyName?.[0] || 'C'}
          </div>
          <div>
            <p className="font-semibold text-black">{row.companyName || 'Client'}</p>
            <p className="text-sm text-gray-500">{row.industry || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <Badge status={row.status === 'active' ? 'active' : 'inactive'} />
      )
    },
    {
      header: 'Hours This Month',
      accessor: () => (
        <span className="text-gray-600">12.5</span>
      )
    }
  ]

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadVAData} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="My Dashboard"
          subtitle={`Welcome back, ${user?.firstName}. Here's your work overview.`}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={Building2}
            label="Assigned Clients"
            value={clients.length}
            trend=""
          />
          <StatCard
            icon={Clock}
            label="Hours This Week"
            value={32}
            trend="+8%"
            trendPositive={true}
            accent
          />
          <StatCard
            icon={CheckCircle}
            label="Tasks Completed"
            value={18}
            trend="+12%"
            trendPositive={true}
          />
          <StatCard
            icon={FileText}
            label="Documents"
            value={documents.length}
            trend=""
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <Card className="h-[320px] flex flex-col">
              <h2 className="text-xl font-bold font-serif text-black mb-4">
                My Clients
              </h2>
              <div className="flex-1 overflow-y-auto">
                {clients.length > 0 ? (
                  <Table columns={clientColumns} data={clients} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No clients assigned yet</p>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="h-[320px] overflow-y-auto">
              <h2 className="text-xl font-bold font-serif text-black mb-4">
                Today's Tasks
              </h2>
              <div className="space-y-3">
                {[
                  { task: 'Review client reports', priority: 'High', status: 'pending' },
                  { task: 'Update time logs', priority: 'Medium', status: 'pending' },
                  { task: 'Client call follow-up', priority: 'Low', status: 'completed' },
                ].map((item, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-black text-sm">
                        {item.task}
                      </p>
                      <Badge
                        status={item.status === 'completed' ? 'active' : 'pending'}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Priority: {item.priority}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Documents */}
        <Card>
          <h2 className="text-xl font-bold font-serif text-black mb-4">
            Recent Documents
          </h2>
          {documents.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-white rounded-lg flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-black text-sm truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(doc._id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No documents yet</p>
          )}
        </Card>
      </div>
    </div>
  )
}
