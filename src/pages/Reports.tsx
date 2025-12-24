import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Eye, Download, RefreshCw } from 'lucide-react'
import { mockReports } from '../data/mockData'
import type { Report } from '../types'

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'custom'>('weekly')

  const filteredReports = mockReports.filter((report) => {
    return report.type === activeTab
  })

  const tabs = [
    { key: 'weekly' as const, label: 'Weekly Reports' },
    { key: 'monthly' as const, label: 'Monthly Reports' },
    { key: 'custom' as const, label: 'Custom Reports' }
  ]

  const columns = [
    {
      header: 'Report Name',
      accessor: 'name' as keyof Report,
      className: 'font-semibold text-black'
    },
    {
      header: 'Client',
      accessor: 'clientName' as keyof Report,
      className: 'text-gray-600'
    },
    {
      header: 'Period',
      accessor: (row: Report) => (
        <span className="text-gray-600">
          {row.periodStart} - {row.periodEnd}
        </span>
      )
    },
    {
      header: 'Type',
      accessor: (row: Report) => (
        <span className="text-gray-600 capitalize">{row.type}</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: Report) => <Badge status={row.status} />
    },
    {
      header: 'Created',
      accessor: 'createdAt' as keyof Report,
      className: 'text-gray-500'
    },
    {
      header: 'Actions',
      accessor: (row: Report) => (
        <div className="flex items-center gap-2">
          {row.pdfUrl && (
            <>
              <button
                onClick={() => console.log('View report:', row.id)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => console.log('Download report:', row.id)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}
          <button
            onClick={() => console.log('Regenerate report:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <Header
        title="Reports"
        subtitle="Generate and manage client reports"
        actions={
          <Button variant="primary">Generate Report</Button>
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <Table columns={columns} data={filteredReports} />
      </Card>
    </>
  )
}
