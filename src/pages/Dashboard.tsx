import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { StatCard } from '../components/common/StatCard'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { UploadArea } from '../components/common/UploadArea'
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
  mockFiles
} from '../data/mockData'
import type { User, FileItem } from '../types'

export const Dashboard: React.FC = () => {
  const [files, setFiles] = useState(mockFiles)

  const handleFileUpload = (uploadedFiles: File[]) => {
    console.log('Files uploaded:', uploadedFiles)
    const newFiles: FileItem[] = uploadedFiles.map((file, index) => ({
      id: files.length + index + 1,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: 'just now',
      type: file.name.split('.').pop() || 'unknown'
    }))
    setFiles([...newFiles, ...files])
  }

  const handleDeleteFile = (fileId: number) => {
    console.log('Deleting file:', fileId)
    setFiles(files.filter(f => f.id !== fileId))
  }

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
    <>
      <Header
        title="Dashboard"
        subtitle="Welcome back, Piyoosh. Here's what's happening today."
        showSearch
        actions={
          <Button variant="primary">Add New</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          label="Tasks This Month"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold font-serif text-black mb-6">
              Recent Users
            </h2>
            <Table columns={userColumns} data={mockRecentUsers} />
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-2xl font-bold font-serif text-black mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.icon)
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div className="p-2 bg-background rounded-lg h-fit">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black text-sm">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
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

      <Card>
        <h2 className="text-2xl font-bold font-serif text-black mb-6">
          Document Management
        </h2>
        <UploadArea onFileSelect={handleFileUpload} />

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Uploaded Files
            </h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-black text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size} • {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => console.log('Downloading:', file.name)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
