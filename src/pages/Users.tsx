import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { UserFormModal } from '../components/modals/UserFormModal'
import { UserDetailsModal } from '../components/modals/UserDetailsModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { Eye, Edit, Trash2, Filter } from 'lucide-react'
import { mockUsers } from '../data/mockData'
import type { User } from '../types'

export const Users: React.FC = () => {
  const { showToast } = useToast()
  const [users, setUsers] = useState(mockUsers)
  const [activeTab, setActiveTab] = useState<'all' | 'clients' | 'vas' | 'admins'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'all') return true
    if (activeTab === 'clients') return user.role === 'client'
    if (activeTab === 'vas') return user.role === 'va'
    if (activeTab === 'admins') return user.role === 'admin'
    return true
  })

  const tabs = [
    { key: 'all' as const, label: 'All Users', count: users.length },
    { key: 'clients' as const, label: 'Clients', count: users.filter(u => u.role === 'client').length },
    { key: 'vas' as const, label: 'Virtual Assistants', count: users.filter(u => u.role === 'va').length },
    { key: 'admins' as const, label: 'Admins', count: users.filter(u => u.role === 'admin').length }
  ]

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

  const handleEditUser = (userData: Partial<User>) => {
    if (!selectedUser) return
    console.log('Editing user:', selectedUser.id, userData)
    setUsers(users.map(u =>
      u.id === selectedUser.id
        ? { ...u, ...userData }
        : u
    ))
    showToast({ type: 'success', message: 'User updated successfully' })
    setSelectedUser(null)
  }

  const handleDeleteUser = () => {
    if (!deleteUserId) return
    console.log('Deleting user:', deleteUserId)
    setUsers(users.filter(u => u.id !== deleteUserId))
    showToast({ type: 'success', message: 'User deleted successfully' })
    setDeleteUserId(null)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const columns = [
    {
      header: 'User',
      accessor: (row: User) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewUser(row)}>
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
            onClick={(e) => { e.stopPropagation(); handleViewUser(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleEditClick(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteUserId(row.id) }}
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
          title="Users"
          subtitle="Manage all users in the system"
          showSearch
          actions={
            <>
              <Button variant="secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add User
              </Button>
            </>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Card className="h-full flex flex-col">
          <div className="border-b border-gray-200 mb-4 flex-shrink-0">
            <nav className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 px-1 border-b-2 transition-colors text-sm ${
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

          <div className="flex-1 overflow-y-auto">
            <Table columns={columns} data={filteredUsers} />
          </div>
        </Card>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateUser}
        mode="create"
      />

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={handleEditUser}
        user={selectedUser || undefined}
        mode="edit"
      />

      <UserDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedUser(null)
        }}
        onEdit={handleEditFromView}
        user={selectedUser}
      />

      <ConfirmationModal
        isOpen={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
