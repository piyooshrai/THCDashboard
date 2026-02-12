import React, { useState, useEffect } from 'react'
import { Header } from '../layout/Header'
import { StatCard } from '../common/StatCard'
import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { useToast } from '../common/Toast'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorMessage } from '../ErrorMessage'
import {
  UserCheck,
  FileText,
  Receipt,
  Clock,
  Download
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { documentService } from '../../services/documentService'

export const ClientDashboard: React.FC = () => {
  const { showToast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    loadClientData()
  }, [])

  const loadClientData = async () => {
    try {
      setLoading(true)
      setError('')

      // In demo mode or with real API, load client-specific data
      const docsRes = await documentService.getAll({ limit: 10 })
      setDocuments(docsRes.documents)
    } catch (err: any) {
      console.error('Failed to load client data:', err)
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

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadClientData} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="My Dashboard"
          subtitle={`Welcome back, ${user?.firstName}. Here's your overview.`}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={UserCheck}
            label="Assigned VAs"
            value={1}
            trend=""
          />
          <StatCard
            icon={Clock}
            label="Hours This Month"
            value={42}
            trend="+5%"
            trendPositive={true}
            accent
          />
          <StatCard
            icon={Receipt}
            label="Pending Invoices"
            value={2}
            trend=""
          />
          <StatCard
            icon={FileText}
            label="Documents"
            value={documents.length}
            trend=""
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* My Virtual Assistant */}
          <Card>
            <h2 className="text-xl font-bold font-serif text-black mb-4">
              My Virtual Assistant
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  VA
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Virtual Assistant</p>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
                <Badge status="active" />
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Current Task</p>
                <p className="font-medium text-black">Processing monthly reports</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-xl font-bold font-serif text-black mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {[
                { action: 'Document uploaded', time: '2 hours ago', icon: FileText },
                { action: 'Task completed', time: '5 hours ago', icon: UserCheck },
                { action: 'Invoice sent', time: '1 day ago', icon: Receipt },
              ].map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex gap-2">
                    <div className="p-2 bg-background rounded-lg h-fit flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black text-sm">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Documents */}
        <Card>
          <h2 className="text-xl font-bold font-serif text-black mb-4">
            My Documents
          </h2>
          {documents.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
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
