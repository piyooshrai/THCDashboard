import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { VAFormModal } from '../components/modals/VAFormModal'
import { ViewVAPerformanceModal } from '../components/modals/ViewVAPerformanceModal'
import { AssignClientModal } from '../components/modals/AssignClientModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { UserCheck, Users, Star, Eye, Edit, Trash2, Filter, UserPlus } from 'lucide-react'
import { mockVAs } from '../data/mockData'
import type { VA } from '../types'

export const VirtualAssistants: React.FC = () => {
  const { showToast } = useToast()
  const [vas, setVas] = useState(mockVAs)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedVA, setSelectedVA] = useState<VA | null>(null)
  const [deleteVAId, setDeleteVAId] = useState<string | null>(null)

  const totalVAs = vas.length
  const activeVAs = vas.filter(v => v.status === 'active').length
  const avgRating = vas.length > 0
    ? (vas.reduce((sum, v) => sum + v.avgRating, 0) / vas.length).toFixed(1)
    : '0.0'

  const handleCreateVA = (vaData: Partial<VA>) => {
    console.log('Creating VA:', vaData)
    const newVA: VA = {
      id: (vas.length + 1).toString(),
      name: vaData.name || '',
      email: vaData.email || '',
      department: vaData.department || '',
      activeClients: 0,
      hoursThisMonth: 0,
      avgRating: 5.0,
      status: vaData.status as 'active' | 'inactive',
      avatar: vaData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'V'
    }
    setVas([newVA, ...vas])
    showToast({ type: 'success', message: 'Virtual assistant created successfully' })
  }

  const handleEditVA = (vaData: Partial<VA>) => {
    if (!selectedVA) return
    console.log('Editing VA:', selectedVA.id, vaData)
    setVas(vas.map(v =>
      v.id === selectedVA.id
        ? { ...v, ...vaData }
        : v
    ))
    showToast({ type: 'success', message: 'Virtual assistant updated successfully' })
    setSelectedVA(null)
  }

  const handleDeleteVA = () => {
    if (!deleteVAId) return
    console.log('Deleting VA:', deleteVAId)
    setVas(vas.filter(v => v.id !== deleteVAId))
    showToast({ type: 'success', message: 'Virtual assistant deleted successfully' })
    setDeleteVAId(null)
  }

  const handleAssignClient = (clientId: string) => {
    if (!selectedVA) return
    console.log('Assigning client', clientId, 'to VA:', selectedVA.id)
    showToast({ type: 'success', message: 'Client assigned successfully' })
  }

  const handleViewVA = (va: VA) => {
    setSelectedVA(va)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (va: VA) => {
    setSelectedVA(va)
    setIsEditModalOpen(true)
  }

  const handleAssignClick = (va: VA) => {
    setSelectedVA(va)
    setIsAssignModalOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const columns = [
    {
      header: 'Virtual Assistant',
      accessor: (row: VA) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewVA(row)}>
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
      header: 'Department',
      accessor: 'department' as keyof VA,
      className: 'text-gray-600'
    },
    {
      header: 'Active Clients',
      accessor: (row: VA) => (
        <span className="font-semibold text-primary">{row.activeClients}</span>
      )
    },
    {
      header: 'Hours This Month',
      accessor: (row: VA) => (
        <span className="text-gray-600">{row.hoursThisMonth}h</span>
      )
    },
    {
      header: 'Avg Rating',
      accessor: (row: VA) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="font-semibold text-black">{row.avgRating}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: VA) => <Badge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: (row: VA) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewVA(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View Performance"
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
            onClick={(e) => { e.stopPropagation(); handleAssignClick(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Assign Client"
          >
            <UserPlus className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteVAId(row.id) }}
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
          title="Virtual Assistants"
          subtitle="Manage VA team and performance"
          showSearch
          actions={
            <>
              <Button variant="secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add VA
              </Button>
            </>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <StatCard
            icon={UserCheck}
            label="Total VAs"
            value={totalVAs}
          />
          <StatCard
            icon={Users}
            label="Active VAs"
            value={activeVAs}
            accent
          />
          <StatCard
            icon={Star}
            label="Average Rating"
            value={`${avgRating}/5.0`}
          />
        </div>

        <Card className="h-[calc(100vh-280px)] flex flex-col">
          <h2 className="text-xl font-bold font-serif text-black mb-4 flex-shrink-0">
            All Virtual Assistants
          </h2>
          <div className="flex-1 overflow-y-auto">
            <Table columns={columns} data={vas} />
          </div>
        </Card>
      </div>

      {/* Modals */}
      <VAFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateVA}
        mode="create"
      />

      <VAFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedVA(null)
        }}
        onSubmit={handleEditVA}
        va={selectedVA || undefined}
        mode="edit"
      />

      <ViewVAPerformanceModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedVA(null)
        }}
        onEdit={handleEditFromView}
        va={selectedVA}
      />

      <AssignClientModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedVA(null)
        }}
        onSubmit={handleAssignClient}
        va={selectedVA}
      />

      <ConfirmationModal
        isOpen={deleteVAId !== null}
        onClose={() => setDeleteVAId(null)}
        onConfirm={handleDeleteVA}
        title="Delete Virtual Assistant"
        message="Are you sure you want to delete this virtual assistant? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
