import React from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Building2, Users, TrendingUp, Eye, Edit, Trash2, Filter } from 'lucide-react'
import { mockClients } from '../data/mockData'
import type { Client } from '../types'

export const Clients: React.FC = () => {
  const totalClients = mockClients.length
  const activeClients = mockClients.filter(c => c.status === 'active').length
  const avgROI = Math.round(
    mockClients.reduce((sum, c) => sum + c.roi, 0) / mockClients.length
  )

  const columns = [
    {
      header: 'Client',
      accessor: (row: Client) => (
        <div className="flex items-center gap-3">
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
            onClick={() => console.log('View client:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Edit client:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Delete client:', row.id)}
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
        title="Clients"
        subtitle="Manage client accounts and ROI tracking"
        showSearch
        actions={
          <>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="primary">Add Client</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <Card>
        <h2 className="text-2xl font-bold font-serif text-black mb-6">
          All Clients
        </h2>
        <Table columns={columns} data={mockClients} />
      </Card>
    </>
  )
}
