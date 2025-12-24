import React from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { UserCheck, Users, Star, Eye, Edit, Trash2, Filter } from 'lucide-react'
import { mockVAs } from '../data/mockData'
import type { VA } from '../types'

export const VirtualAssistants: React.FC = () => {
  const totalVAs = mockVAs.length
  const activeVAs = mockVAs.filter(v => v.status === 'active').length
  const avgRating = (
    mockVAs.reduce((sum, v) => sum + v.avgRating, 0) / mockVAs.length
  ).toFixed(1)

  const columns = [
    {
      header: 'Virtual Assistant',
      accessor: (row: VA) => (
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
            onClick={() => console.log('View VA:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Edit VA:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Delete VA:', row.id)}
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
        title="Virtual Assistants"
        subtitle="Manage VA team and performance"
        showSearch
        actions={
          <>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="primary">Add VA</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <Card>
        <h2 className="text-2xl font-bold font-serif text-black mb-6">
          All Virtual Assistants
        </h2>
        <Table columns={columns} data={mockVAs} />
      </Card>
    </>
  )
}
