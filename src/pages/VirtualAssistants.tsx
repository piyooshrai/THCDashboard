import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { VAFormModal } from '../components/modals/VAFormModal'
import { ViewVAPerformanceModal } from '../components/modals/ViewVAPerformanceModal'
import { AssignClientModal } from '../components/modals/AssignClientModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { UserCheck, Users, Star, Eye, Edit, Trash2, Filter, UserPlus } from 'lucide-react'
import { vaService } from '../services/vaService'
import type { VA as APIVA, VAPerformance } from '../services/vaService'
import type { VA } from '../types'

export const VirtualAssistants: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vas, setVas] = useState<APIVA[]>([])
  const [vaPerformance, setVaPerformance] = useState<Record<string, VAPerformance>>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedVA, setSelectedVA] = useState<APIVA | null>(null)
  const [deleteVAId, setDeleteVAId] = useState<string | null>(null)

  // Load VAs on mount
  useEffect(() => {
    loadVAs()
  }, [])

  const loadVAs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await vaService.getAll()
      setVas(response.vas)

      // Load performance for each VA
      const performanceData: Record<string, VAPerformance> = {}
      for (const va of response.vas) {
        try {
          const perfResponse = await vaService.getPerformance(va._id)
          performanceData[va._id] = perfResponse.performance
        } catch (err) {
          console.error(`Failed to load performance for VA ${va._id}:`, err)
        }
      }
      setVaPerformance(performanceData)
    } catch (err: any) {
      console.error('Failed to load VAs:', err)
      setError(err.response?.data?.error || 'Failed to load virtual assistants')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalVAs = vas.length
  const activeVAs = vas.filter(v => v.status === 'active').length
  const avgRating = Object.values(vaPerformance).length > 0
    ? (
        Object.values(vaPerformance).reduce((sum, perf) => sum + (perf.averageRating || 0), 0) /
        Object.values(vaPerformance).length
      ).toFixed(1)
    : '0.0'

  const handleCreateVA = async (vaData: Partial<VA>) => {
    try {
      const createData = {
        userId: vaData.email || '', // Will need to create user first in production
        specialization: vaData.department ? [vaData.department] : [],
        hourlyRate: 60, // Default rate
        status: (vaData.status as 'active' | 'inactive' | 'on-leave') || 'active',
      }

      await vaService.create(createData)
      showToast({ type: 'success', message: 'Virtual assistant created successfully' })

      // Reload VAs list
      await loadVAs()
      setIsAddModalOpen(false)
    } catch (err: any) {
      console.error('Failed to create VA:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to create VA' })
    }
  }

  const handleEditVA = async (vaData: Partial<VA>) => {
    if (!selectedVA) return

    try {
      const updateData = {
        specialization: vaData.department ? [vaData.department] : undefined,
        hourlyRate: 60,
        status: vaData.status as 'active' | 'inactive' | 'on-leave',
      }

      await vaService.update(selectedVA._id, updateData)
      showToast({ type: 'success', message: 'Virtual assistant updated successfully' })

      // Reload VAs list
      await loadVAs()
      setIsEditModalOpen(false)
      setSelectedVA(null)
    } catch (err: any) {
      console.error('Failed to update VA:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to update VA' })
    }
  }

  const handleDeleteVA = async () => {
    if (!deleteVAId) return

    try {
      await vaService.delete(deleteVAId)
      showToast({ type: 'success', message: 'Virtual assistant deleted successfully' })

      // Reload VAs list
      await loadVAs()
      setDeleteVAId(null)
    } catch (err: any) {
      console.error('Failed to delete VA:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete VA' })
    }
  }

  const handleAssignClient = (clientId: string) => {
    if (!selectedVA) return
    // This would call an API to assign client to VA
    console.log('Assigning client', clientId, 'to VA:', selectedVA._id)
    showToast({ type: 'info', message: 'Client assignment requires backend implementation' })
  }

  const handleViewVA = (va: APIVA) => {
    setSelectedVA(va)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (va: APIVA) => {
    setSelectedVA(va)
    setIsEditModalOpen(true)
  }

  const handleAssignClick = (va: APIVA) => {
    setSelectedVA(va)
    setIsAssignModalOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  // Convert API VA to legacy VA format for modals
  const convertToLegacyVA = (apiVA: APIVA | null): VA | undefined => {
    if (!apiVA) return undefined

    const performance = vaPerformance[apiVA._id]

    return {
      id: apiVA._id,
      name: apiVA.userId, // Will need to fetch actual user name in production
      email: apiVA.userId,
      department: apiVA.specialization?.[0] || 'General',
      activeClients: apiVA.assignedClients?.length || 0,
      hoursThisMonth: performance?.totalHoursWorked || 0,
      avgRating: performance?.averageRating || 5.0,
      status: apiVA.status === 'on-leave' ? 'inactive' : apiVA.status,
      avatar: apiVA.userId?.substring(0, 2).toUpperCase() || 'VA'
    }
  }

  const columns = [
    {
      header: 'Virtual Assistant',
      accessor: (row: APIVA) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewVA(row)}>
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {row.userId?.substring(0, 2).toUpperCase() || 'VA'}
          </div>
          <div>
            <p className="font-semibold text-black">{row.userId}</p>
            <p className="text-sm text-gray-500">{row.specialization?.[0] || 'General'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: (row: APIVA) => (
        <span className="text-gray-600">{row.specialization?.[0] || 'General'}</span>
      ),
      className: 'text-gray-600'
    },
    {
      header: 'Active Clients',
      accessor: (row: APIVA) => (
        <span className="font-semibold text-primary">{row.assignedClients?.length || 0}</span>
      )
    },
    {
      header: 'Hours This Month',
      accessor: (row: APIVA) => {
        const performance = vaPerformance[row._id]
        return (
          <span className="text-gray-600">
            {performance?.totalHoursWorked?.toFixed(0) || '0'}h
          </span>
        )
      }
    },
    {
      header: 'Avg Rating',
      accessor: (row: APIVA) => {
        const performance = vaPerformance[row._id]
        return (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="font-semibold text-black">
              {performance?.averageRating?.toFixed(1) || '5.0'}
            </span>
          </div>
        )
      }
    },
    {
      header: 'Status',
      accessor: (row: APIVA) => (
        <Badge status={row.status === 'on-leave' ? 'inactive' : row.status} />
      )
    },
    {
      header: 'Actions',
      accessor: (row: APIVA) => (
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
            onClick={(e) => { e.stopPropagation(); setDeleteVAId(row._id) }}
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
    return <LoadingSpinner message="Loading virtual assistants..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadVAs} />
  }

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
            {vas.length > 0 ? (
              <Table columns={columns} data={vas} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No virtual assistants found</p>
                <p className="text-gray-400 text-sm mt-2">Add a new VA to get started</p>
              </div>
            )}
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
        va={convertToLegacyVA(selectedVA)}
        mode="edit"
      />

      <ViewVAPerformanceModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedVA(null)
        }}
        onEdit={handleEditFromView}
        va={convertToLegacyVA(selectedVA) || null}
      />

      <AssignClientModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedVA(null)
        }}
        onSubmit={handleAssignClient}
        va={convertToLegacyVA(selectedVA) || null}
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
