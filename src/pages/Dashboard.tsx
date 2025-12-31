import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { StatCard } from '../components/common/StatCard'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { UserFormModal } from '../components/modals/UserFormModal'
import { UploadDocumentModal } from '../components/modals/UploadDocumentModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import {
  Users,
  Building2,
  CheckCircle,
  DollarSign,
  FileText,
  Download,
  Trash2
} from 'lucide-react'
import { analyticsService } from '../services/analyticsService'
import { userService } from '../services/userService'
import type { User as APIUser } from '../services/userService'
import { clientService } from '../services/clientService'
import { documentService } from '../services/documentService'
import type { Document } from '../services/documentService'
import { useAuth } from '../contexts/AuthContext'
import type { User } from '../types'

export const Dashboard: React.FC = () => {
  const { showToast } = useToast()
  const { user: currentUser } = useAuth()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<APIUser[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [clients, setClients] = useState<any[]>([])

  // Modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      const [dashboardRes, usersRes, docsRes, clientsRes] = await Promise.all([
        analyticsService.getDashboard(),
        userService.getAll({ limit: 5 }),
        documentService.getAll({ limit: 5 }),
        clientService.getAll({ limit: 10 })
      ])

      setStats(dashboardRes.stats)
      setUsers(usersRes.users)
      setDocuments(docsRes.documents)
      setClients(clientsRes.clients)
    } catch (err: any) {
      console.error('Failed to load dashboard:', err)
      setError(err.response?.data?.error || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (_userData: Partial<User>) => {
    try {
      // In a real app, you'd call the API here with _userData
      // For now, refresh the user list
      showToast({ type: 'info', message: 'User creation requires admin backend access' })
      const usersRes = await userService.getAll({ limit: 5 })
      setUsers(usersRes.users)
    } catch (err: any) {
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to create user' })
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

      // Refresh documents list
      const docsRes = await documentService.getAll({ limit: 5 })
      setDocuments(docsRes.documents)
    } catch (err: any) {
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to upload files' })
    }
  }

  const handleDeleteDocument = async () => {
    if (!deleteDocId) return

    try {
      await documentService.delete(deleteDocId)
      showToast({ type: 'success', message: 'Document deleted successfully' })

      // Refresh documents list
      const docsRes = await documentService.getAll({ limit: 5 })
      setDocuments(docsRes.documents)
      setDeleteDocId(null)
    } catch (err: any) {
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete document' })
    }
  }

  const handleDownloadDocument = async (docId: string) => {
    try {
      await documentService.download(docId)
    } catch (err: any) {
      showToast({ type: 'error', message: 'Failed to download document' })
    }
  }

  const clientOptions = clients.map(c => ({
    value: c._id,
    label: c.companyName || `${c.userId}`
  }))

  const userColumns = [
    {
      header: 'User',
      accessor: (row: APIUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-black">{row.firstName} {row.lastName}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (row: APIUser) => (
        <span className="text-gray-600 capitalize">{row.role}</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: APIUser) => (
        <Badge status={row.isActive ? 'active' : 'inactive'} />
      )
    },
    {
      header: 'Joined',
      accessor: (row: APIUser) => (
        <span className="text-gray-500">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      className: 'text-gray-500'
    }
  ]

  const getActivityIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      FileText,
      Users,
      DollarSign,
      CheckCircle
    }
    return icons[iconName] || FileText
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDashboardData} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Dashboard"
          subtitle={`Welcome back, ${currentUser?.firstName || 'User'}. Here's what's happening today.`}
          showSearch
          actions={
            currentUser?.role === 'admin' ? (
              <Button variant="primary" onClick={() => setIsAddUserModalOpen(true)}>
                Add New
              </Button>
            ) : null
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Clients"
            value={stats?.totalClients || 0}
            trend="+12%"
            trendPositive={true}
          />
          <StatCard
            icon={Building2}
            label="Active VAs"
            value={stats?.activeVAs || 0}
            trend="+8%"
            trendPositive={true}
            accent
          />
          <StatCard
            icon={CheckCircle}
            label="Hours Logged"
            value={stats?.totalHoursLogged || 0}
            trend="+23%"
            trendPositive={true}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            trend="+15%"
            trendPositive={true}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <Card className="h-[320px] flex flex-col">
              <h2 className="text-xl font-bold font-serif text-black mb-4">
                Recent Users
              </h2>
              <div className="flex-1 overflow-y-auto">
                {users.length > 0 ? (
                  <Table columns={userColumns} data={users} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No users found</p>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="h-[320px] overflow-y-auto">
              <h2 className="text-xl font-bold font-serif text-black mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {stats?.recentActivity?.map((activity: any, index: number) => {
                  const Icon = getActivityIcon(activity.type || 'FileText')
                  return (
                    <div key={index} className="flex gap-2">
                      <div className="p-2 bg-background rounded-lg h-fit flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Document Management */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-serif text-black">
              Document Management
            </h2>
            <Button variant="secondary" onClick={() => setIsUploadModalOpen(true)}>
              Upload Files
            </Button>
          </div>

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
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleDownloadDocument(doc._id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setDeleteDocId(doc._id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          )}
        </Card>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateUser}
        mode="create"
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleFileUpload}
        clients={clientOptions}
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
