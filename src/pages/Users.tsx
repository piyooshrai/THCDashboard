import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Eye, Edit, Trash2, Filter } from 'lucide-react'
import { mockUsers } from '../data/mockData'
import type { User } from '../types'

export const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'clients' | 'vas' | 'admins'>('all')

  const filteredUsers = mockUsers.filter((user) => {
    if (activeTab === 'all') return true
    if (activeTab === 'clients') return user.role === 'client'
    if (activeTab === 'vas') return user.role === 'va'
    if (activeTab === 'admins') return user.role === 'admin'
    return true
  })

  const tabs = [
    { key: 'all' as const, label: 'All Users', count: mockUsers.length },
    { key: 'clients' as const, label: 'Clients', count: mockUsers.filter(u => u.role === 'client').length },
    { key: 'vas' as const, label: 'Virtual Assistants', count: mockUsers.filter(u => u.role === 'va').length },
    { key: 'admins' as const, label: 'Admins', count: mockUsers.filter(u => u.role === 'admin').length }
  ]

  const columns = [
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
        <span className="text-gray-600 capitalize">
          {row.role === 'va' ? 'Virtual Assistant' : row.role}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: User) => <Badge status={row.status} />
    },
    {
      header: 'Joined Date',
      accessor: 'joined' as keyof User,
      className: 'text-gray-500'
    },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log('View user:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Edit user:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Delete user:', row.id)}
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
        title="Users"
        subtitle="Manage all users in the system"
        showSearch
        actions={
          <>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="primary">Add User</Button>
          </>
        }
      />

      <Card>
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <Table columns={columns} data={filteredUsers} />
      </Card>
    </>
  )
}
