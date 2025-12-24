import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { GenerateReportModal } from '../components/modals/GenerateReportModal'
import { ViewReportModal } from '../components/modals/ViewReportModal'
import { Eye, Download, RefreshCw, Plus } from 'lucide-react'
import { mockReports } from '../data/mockData'
import type { Report } from '../types'

export const Reports: React.FC = () => {
  const { showToast } = useToast()
  const [reports, setReports] = useState(mockReports)
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'custom'>('weekly')
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const filteredReports = reports.filter((report) => {
    return report.type === activeTab
  })

  const tabs = [
    { key: 'weekly' as const, label: 'Weekly Reports' },
    { key: 'monthly' as const, label: 'Monthly Reports' },
    { key: 'custom' as const, label: 'Custom Reports' }
  ]

  const handleGenerateReport = (data: { clientId: string; type: string; periodStart: string; periodEnd: string }) => {
    console.log('Generating report:', data)
    const client = mockReports.find(r => r.clientId === data.clientId)
    const newReport: Report = {
      id: (reports.length + 1).toString(),
      name: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Report - ${client?.clientName || 'Client'}`,
      clientId: data.clientId,
      clientName: client?.clientName || 'Client',
      type: data.type as 'weekly' | 'monthly' | 'custom',
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      status: 'generated',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pdfUrl: '#'
    }
    setReports([newReport, ...reports])
    showToast({ type: 'success', message: 'Report generated successfully' })
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleDownload = (report: Report) => {
    console.log('Downloading report:', report.pdfUrl)
    showToast({ type: 'success', message: `Downloading ${report.name}...` })
  }

  const handleRegenerate = (report: Report) => {
    console.log('Regenerating report:', report.id)
    showToast({ type: 'success', message: 'Report regeneration started' })
  }

  const columns = [
    {
      header: 'Report Name',
      accessor: (row: Report) => (
        <div className="cursor-pointer" onClick={() => handleViewReport(row)}>
          <span className="font-semibold text-black">{row.name}</span>
        </div>
      )
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
                onClick={(e) => { e.stopPropagation(); handleViewReport(row) }}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(row) }}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleRegenerate(row) }}
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
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Reports"
          subtitle="Generate and manage client reports"
          actions={
            <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Card className="h-full flex flex-col">
          <div className="border-b border-gray-200 mb-4 flex-shrink-0">
            <nav className="flex gap-8">
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
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table columns={columns} data={filteredReports} />
          </div>
        </Card>
      </div>

      {/* Modals */}
      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateReport}
      />

      <ViewReportModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedReport(null)
        }}
        report={selectedReport}
      />
    </div>
  )
}
