import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { StatCard } from '../components/common/StatCard'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
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
import {
  mockStats,
  mockRecentUsers,
  mockRecentActivity,
  mockFiles,
  mockClients
} from '../data/mockData'
import type { User, FileItem } from '../types'

export const Dashboard: React.FC = () => {
  const { showToast } = useToast()
  const [users, setUsers] = useState(mockRecentUsers)
  const [files, setFiles] = useState(mockFiles)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deleteFileId, setDeleteFileId] = useState<number | null>(null)

  const handleCreateUser = (userData: Partial<User>) => {
    console.log('Creating user:', userData)
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role as 'client' | 'va' | 'admin',
      status: userData.status as 'active' | 'inactive' | 'pending',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
    }
    setUsers([newUser, ...users])
    showToast({ type: 'success', message: 'User created successfully' })
  }

  const handleFileUpload = (data: { files: File[]; clientId?: string; notes?: string }) => {
    console.log('Files uploaded:', data)
    const newFiles: FileItem[] = data.files.map((file, index) => ({
      id: files.length + index + 1,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: 'just now',
      type: file.name.split('.').pop() || 'unknown'
    }))
    setFiles([...newFiles, ...files])
    showToast({ type: 'success', message: `${data.files.length} file(s) uploaded successfully` })
  }

  const handleDeleteFile = () => {
    if (deleteFileId) {
      console.log('Deleting file:', deleteFileId)
      setFiles(files.filter(f => f.id !== deleteFileId))
      showToast({ type: 'success', message: 'File deleted successfully' })
      setDeleteFileId(null)
    }
  }

  const clientOptions = mockClients.map(c => ({
    value: c.id,
    label: c.name
  }))

  const userColumns = [
    {
      header: 'User',
      accessor: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {row.avatar}
          </div>
          <div>
            <p className="font-semibold text-black">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (row: User) => (
        <span className="text-gray-600 capitalize">{row.role}</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: User) => <Badge status={row.status} />
    },
    {
      header: 'Joined',
      accessor: 'joined' as keyof User,
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Dashboard"
          subtitle="Welcome back, Piyoosh. Here's what's happening today."
          showSearch
          actions={
            <Button variant="primary" onClick={() => setIsAddUserModalOpen(true)}>
              Add New
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Stats - Compact */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={mockStats.totalUsers.value}
            trend={mockStats.totalUsers.trend}
            trendPositive={mockStats.totalUsers.positive}
          />
          <StatCard
            icon={Building2}
            label="Active Clients"
            value={mockStats.activeClients.value}
            trend={mockStats.activeClients.trend}
            trendPositive={mockStats.activeClients.positive}
            accent
          />
          <StatCard
            icon={CheckCircle}
            label="Tasks"
            value={mockStats.tasksThisMonth.value}
            trend={mockStats.tasksThisMonth.trend}
            trendPositive={mockStats.tasksThisMonth.positive}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={mockStats.revenue.value}
            trend={mockStats.revenue.trend}
            trendPositive={mockStats.revenue.positive}
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
                <Table columns={userColumns} data={users} />
              </div>
            </Card>
          </div>

          <div>
            <Card className="h-[320px] overflow-y-auto">
              <h2 className="text-xl font-bold font-serif text-black mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {mockRecentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.icon)
                  return (
                    <div key={activity.id} className="flex gap-2">
                      <div className="p-2 bg-background rounded-lg h-fit flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {activity.description}
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
        </div>

        {/* Document Management - Compact */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-serif text-black">
              Document Management
            </h2>
            <Button variant="secondary" onClick={() => setIsUploadModalOpen(true)}>
              Upload Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {files.slice(0, 5).map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-white rounded-lg flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-black text-sm truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size} • {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => console.log('Downloading:', file.name)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setDeleteFileId(file.id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
        isOpen={deleteFileId !== null}
        onClose={() => setDeleteFileId(null)}
        onConfirm={handleDeleteFile}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
