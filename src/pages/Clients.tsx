import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { ClientFormModal } from '../components/modals/ClientFormModal'
import { ViewClientROIModal } from '../components/modals/ViewClientROIModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { Building2, Users, TrendingUp, Eye, Edit, Trash2, Filter, ExternalLink } from 'lucide-react'
import { clientService, Client as APIClient, ROICalculation } from '../services/clientService'
import type { Client } from '../types'

export const Clients: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clients, setClients] = useState<APIClient[]>([])
  const [clientROI, setClientROI] = useState<Record<string, ROICalculation>>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewROIModalOpen, setIsViewROIModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<APIClient | null>(null)
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null)

  // Load clients on mount
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await clientService.getAll()
      setClients(response.clients)

      // Load ROI for each client
      const roiData: Record<string, ROICalculation> = {}
      for (const client of response.clients) {
        try {
          const roiResponse = await clientService.getROI(client._id, 'monthly')
          roiData[client._id] = roiResponse.roi
        } catch (err) {
          console.error(`Failed to load ROI for client ${client._id}:`, err)
          // Continue with other clients even if one fails
        }
      }
      setClientROI(roiData)
    } catch (err: any) {
      console.error('Failed to load clients:', err)
      setError(err.response?.data?.error || 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'active').length
  const avgROI = Object.values(clientROI).length > 0
    ? Math.round(
        Object.values(clientROI).reduce((sum, roi) => sum + roi.roiPercentage, 0) /
        Object.values(clientROI).length
      )
    : 0

  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      const createData = {
        userId: clientData.email || '', // Will need to create user first in production
        companyName: clientData.company || '',
        industry: clientData.industry || '',
        jobTitle: clientData.jobTitle || '',
        locationState: clientData.location,
        baselineAdminHoursPerWeek: clientData.baselineHours || 0,
        hourlyValueOverride: clientData.hourlyValue,
        status: (clientData.status as 'active' | 'inactive' | 'pending') || 'pending',
      }

      await clientService.create(createData)
      showToast({ type: 'success', message: 'Client created successfully' })

      // Reload clients list
      await loadClients()
      setIsAddModalOpen(false)
    } catch (err: any) {
      console.error('Failed to create client:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to create client' })
    }
  }

  const handleEditClient = async (clientData: Partial<Client>) => {
    if (!selectedClient) return

    try {
      const updateData = {
        companyName: clientData.company,
        industry: clientData.industry,
        jobTitle: clientData.jobTitle,
        locationState: clientData.location,
        baselineAdminHoursPerWeek: clientData.baselineHours,
        hourlyValueOverride: clientData.hourlyValue,
        status: clientData.status as 'active' | 'inactive' | 'pending',
      }

      await clientService.update(selectedClient._id, updateData)
      showToast({ type: 'success', message: 'Client updated successfully' })

      // Reload clients list
      await loadClients()
      setIsEditModalOpen(false)
      setSelectedClient(null)
    } catch (err: any) {
      console.error('Failed to update client:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to update client' })
    }
  }

  const handleDeleteClient = async () => {
    if (!deleteClientId) return

    try {
      await clientService.delete(deleteClientId)
      showToast({ type: 'success', message: 'Client deleted successfully' })

      // Reload clients list
      await loadClients()
      setDeleteClientId(null)
    } catch (err: any) {
      console.error('Failed to delete client:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete client' })
    }
  }

  const handleViewROI = (client: APIClient) => {
    setSelectedClient(client)
    setIsViewROIModalOpen(true)
  }

  const handleEditClick = (client: APIClient) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  // Convert API client to legacy Client format for modals
  const convertToLegacyClient = (apiClient: APIClient | null): Client | undefined => {
    if (!apiClient) return undefined

    const roi = clientROI[apiClient._id]

    return {
      id: apiClient._id,
      name: apiClient.userId, // Will need to fetch actual user name in production
      email: apiClient.userId,
      company: apiClient.companyName,
      industry: apiClient.industry,
      jobTitle: apiClient.jobTitle,
      location: apiClient.locationState || '',
      hourlyValue: apiClient.hourlyValueOverride || apiClient.calculatedHourlyValue,
      baselineHours: apiClient.baselineAdminHoursPerWeek,
      hoursReclaimed: roi?.hoursReclaimed || 0,
      vaHoursWorked: 0, // Would need to calculate from time logs
      roi: roi?.roiPercentage || 0,
      status: apiClient.status,
      avatar: apiClient.companyName?.substring(0, 2).toUpperCase() || 'CL'
    }
  }

  const columns = [
    {
      header: 'Client',
      accessor: (row: APIClient) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewROI(row)}>
          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
            {row.companyName?.substring(0, 2).toUpperCase() || 'CL'}
          </div>
          <div>
            <p className="font-semibold text-black">{row.companyName}</p>
            <p className="text-sm text-gray-500">{row.industry}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Industry',
      accessor: (row: APIClient) => (
        <span className="text-gray-600">{row.industry}</span>
      ),
      className: 'text-gray-600'
    },
    {
      header: 'Hourly Value',
      accessor: (row: APIClient) => (
        <span className="text-gray-600">
          ${row.hourlyValueOverride || row.calculatedHourlyValue}/hr
        </span>
      )
    },
    {
      header: 'Hours Reclaimed',
      accessor: (row: APIClient) => {
        const roi = clientROI[row._id]
        return (
          <span className="font-semibold text-primary">
            {roi?.hoursReclaimed?.toFixed(1) || '0.0'}h
          </span>
        )
      }
    },
    {
      header: 'ROI',
      accessor: (row: APIClient) => {
        const roi = clientROI[row._id]
        return (
          <span className="font-bold text-success">
            {roi?.roiPercentage?.toFixed(0) || '0'}%
          </span>
        )
      }
    },
    {
      header: 'Status',
      accessor: (row: APIClient) => <Badge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: (row: APIClient) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/client-portal/${row._id}`) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View Client Portal"
          >
            <ExternalLink className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleViewROI(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View ROI"
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
            onClick={(e) => { e.stopPropagation(); setDeleteClientId(row._id) }}
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
    return <LoadingSpinner message="Loading clients..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadClients} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Clients"
          subtitle="Manage client accounts and ROI tracking"
          showSearch
          actions={
            <>
              <Button variant="secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add Client
              </Button>
            </>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <StatCard
            icon={Building2}
            label="Total Clients"
            value={totalClients}
          />
          <StatCard
            icon={Users}
            label="Active Clients"
            value={activeClients}
            accent
          />
          <StatCard
            icon={TrendingUp}
            label="Average ROI"
            value={`${avgROI}%`}
          />
        </div>

        <Card className="h-[calc(100vh-280px)] flex flex-col">
          <h2 className="text-xl font-bold font-serif text-black mb-4 flex-shrink-0">
            All Clients
          </h2>
          <div className="flex-1 overflow-y-auto">
            {clients.length > 0 ? (
              <Table columns={columns} data={clients} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No clients found</p>
                <p className="text-gray-400 text-sm mt-2">Add a new client to get started</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ClientFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateClient}
        mode="create"
      />

      <ClientFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedClient(null)
        }}
        onSubmit={handleEditClient}
        client={convertToLegacyClient(selectedClient)}
        mode="edit"
      />

      <ViewClientROIModal
        isOpen={isViewROIModalOpen}
        onClose={() => {
          setIsViewROIModalOpen(false)
          setSelectedClient(null)
        }}
        client={convertToLegacyClient(selectedClient) || null}
      />

      <ConfirmationModal
        isOpen={deleteClientId !== null}
        onClose={() => setDeleteClientId(null)}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
