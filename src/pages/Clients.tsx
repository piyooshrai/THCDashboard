import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { ClientFormModal } from '../components/modals/ClientFormModal'
import { ViewClientROIModal } from '../components/modals/ViewClientROIModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { Building2, Users, TrendingUp, Eye, Edit, Trash2, Filter } from 'lucide-react'
import { mockClients } from '../data/mockData'
import type { Client } from '../types'

export const Clients: React.FC = () => {
  const { showToast } = useToast()
  const [clients, setClients] = useState(mockClients)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewROIModalOpen, setIsViewROIModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null)

  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'active').length
  const avgROI = clients.length > 0
    ? Math.round(clients.reduce((sum, c) => sum + c.roi, 0) / clients.length)
    : 0

  const handleCreateClient = (clientData: Partial<Client>) => {
    console.log('Creating client:', clientData)
    const newClient: Client = {
      id: (clients.length + 1).toString(),
      name: clientData.name || '',
      email: clientData.email || '',
      company: clientData.company || '',
      industry: clientData.industry || '',
      jobTitle: clientData.jobTitle || '',
      location: clientData.location || '',
      hourlyValue: clientData.hourlyValue || 0,
      baselineHours: clientData.baselineHours || 0,
      hoursReclaimed: 0,
      vaHoursWorked: 0,
      roi: 0,
      status: clientData.status as 'active' | 'inactive',
      avatar: clientData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'
    }
    setClients([newClient, ...clients])
    showToast({ type: 'success', message: 'Client created successfully' })
  }

  const handleEditClient = (clientData: Partial<Client>) => {
    if (!selectedClient) return
    console.log('Editing client:', selectedClient.id, clientData)
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? { ...c, ...clientData }
        : c
    ))
    showToast({ type: 'success', message: 'Client updated successfully' })
    setSelectedClient(null)
  }

  const handleDeleteClient = () => {
    if (!deleteClientId) return
    console.log('Deleting client:', deleteClientId)
    setClients(clients.filter(c => c.id !== deleteClientId))
    showToast({ type: 'success', message: 'Client deleted successfully' })
    setDeleteClientId(null)
  }

  const handleViewROI = (client: Client) => {
    setSelectedClient(client)
    setIsViewROIModalOpen(true)
  }

  const handleEditClick = (client: Client) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  const columns = [
    {
      header: 'Client',
      accessor: (row: Client) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewROI(row)}>
          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
            {row.avatar}
          </div>
          <div>
            <p className="font-semibold text-black">{row.name}</p>
            <p className="text-sm text-gray-500">{row.company}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Industry',
      accessor: 'industry' as keyof Client,
      className: 'text-gray-600'
    },
    {
      header: 'Hourly Value',
      accessor: (row: Client) => <span className="text-gray-600">${row.hourlyValue}/hr</span>
    },
    {
      header: 'Hours Reclaimed',
      accessor: (row: Client) => (
        <span className="font-semibold text-primary">{row.hoursReclaimed}h</span>
      )
    },
    {
      header: 'ROI',
      accessor: (row: Client) => (
        <span className="font-bold text-success">{row.roi}%</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: Client) => <Badge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: (row: Client) => (
        <div className="flex items-center gap-2">
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
            onClick={(e) => { e.stopPropagation(); setDeleteClientId(row.id) }}
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
            <Table columns={columns} data={clients} />
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
        client={selectedClient || undefined}
        mode="edit"
      />

      <ViewClientROIModal
        isOpen={isViewROIModalOpen}
        onClose={() => {
          setIsViewROIModalOpen(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
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
