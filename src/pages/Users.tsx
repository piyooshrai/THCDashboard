import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { UserFormModal } from '../components/modals/UserFormModal'
import { UserDetailsModal } from '../components/modals/UserDetailsModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { Eye, Edit, Trash2, Filter } from 'lucide-react'
import { userService } from '../services/userService'
import type { User as APIUser } from '../services/userService'
import { authService } from '../services/authService'
import type { RegisterData } from '../services/authService'
import type { User } from '../types'

export const Users: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<APIUser[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'client' | 'va' | 'admin'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<APIUser | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  // Load users on mount and when tab changes
  useEffect(() => {
    loadUsers()
  }, [activeTab])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const params = activeTab === 'all' ? {} : { role: activeTab }
      const response = await userService.getAll(params)
      setUsers(response.users)
    } catch (err: any) {
      console.error('Failed to load users:', err)
      setError(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'all') return true
    return user.role === activeTab
  })

  const tabs = [
    { key: 'all' as const, label: 'All Users', count: users.filter(u => activeTab === 'all' || u.role === activeTab).length },
    { key: 'client' as const, label: 'Clients', count: users.filter(u => u.role === 'client').length },
    { key: 'va' as const, label: 'Virtual Assistants', count: users.filter(u => u.role === 'va').length },
    { key: 'admin' as const, label: 'Admins', count: users.filter(u => u.role === 'admin').length }
  ]

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      // Create user via auth service (registration)
      const registerData: RegisterData = {
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        password: 'TempPass123!', // Temporary password - should be changed on first login
        role: (userData.role as 'admin' | 'client' | 'va') || 'client',
        phone: userData.phone,
      }

      await authService.register(registerData)
      showToast({ type: 'success', message: 'User created successfully' })

      // Reload users list
      await loadUsers()
      setIsAddModalOpen(false)
    } catch (err: any) {
      console.error('Failed to create user:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to create user' })
    }
  }

  const handleEditUser = async (userData: Partial<User>) => {
    if (!selectedUser) return

    try {
      const updateData = {
        firstName: userData.name?.split(' ')[0],
        lastName: userData.name?.split(' ').slice(1).join(' '),
        email: userData.email,
        phone: userData.phone,
        isActive: userData.status === 'active',
      }

      await userService.update(selectedUser._id, updateData)
      showToast({ type: 'success', message: 'User updated successfully' })

      // Reload users list
      await loadUsers()
      setIsEditModalOpen(false)
      setSelectedUser(null)
    } catch (err: any) {
      console.error('Failed to update user:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to update user' })
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteUserId) return

    try {
      await userService.delete(deleteUserId)
      showToast({ type: 'success', message: 'User deleted successfully' })

      // Reload users list
      await loadUsers()
      setDeleteUserId(null)
    } catch (err: any) {
      console.error('Failed to delete user:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete user' })
    }
  }

  const handleViewUser = (user: APIUser) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (user: APIUser) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  // Convert API user to legacy User format for modals
  const convertToLegacyUser = (apiUser: APIUser | null): User | undefined => {
    if (!apiUser) return undefined
    return {
      id: apiUser._id,
      name: `${apiUser.firstName} ${apiUser.lastName}`,
      email: apiUser.email,
      role: apiUser.role,
      status: apiUser.isActive ? 'active' : 'inactive',
      joined: new Date(apiUser.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      avatar: `${apiUser.firstName?.charAt(0)}${apiUser.lastName?.charAt(0)}`.toUpperCase(),
      phone: apiUser.phone
    }
  }

  const columns = [
    {
      header: 'User',
      accessor: (row: APIUser) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewUser(row)}>
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
        <span className="text-gray-600 capitalize">
          {row.role === 'va' ? 'Virtual Assistant' : row.role}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: APIUser) => (
        <Badge status={row.isActive ? 'active' : 'inactive'} />
      )
    },
    {
      header: 'Joined Date',
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
    },
    {
      header: 'Actions',
      accessor: (row: APIUser) => (
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
            onClick={(e) => { e.stopPropagation(); setDeleteUserId(row._id) }}
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
    return <LoadingSpinner message="Loading users..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadUsers} />
  }

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
            {filteredUsers.length > 0 ? (
              <Table columns={columns} data={filteredUsers} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No users found</p>
                <p className="text-gray-400 text-sm mt-2">Add a new user to get started</p>
              </div>
            )}
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
        user={convertToLegacyUser(selectedUser)}
        mode="edit"
      />

      <UserDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedUser(null)
        }}
        onEdit={handleEditFromView}
        user={convertToLegacyUser(selectedUser) || null}
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
