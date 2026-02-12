import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useToast } from '../components/common/Toast'
import { GenerateReportModal } from '../components/modals/GenerateReportModal'
import { ViewReportModal } from '../components/modals/ViewReportModal'
import { Eye, Download, RefreshCw, Plus } from 'lucide-react'
import { reportService } from '../services/reportService'
import type { Report } from '../types'

export const Reports: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reports, setReports] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'custom'>('weekly')
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any | null>(null)

  // Load reports on mount
  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await reportService.getAll()
      setReports(response.reports || [])
    } catch (err: any) {
      console.error('Failed to load reports:', err)
      setError(err.response?.data?.error || 'Failed to load reports')
      setReports([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = (reports || []).filter((report) => {
    return report.reportType === activeTab
  })

  const tabs = [
    { key: 'weekly' as const, label: 'Weekly Reports' },
    { key: 'monthly' as const, label: 'Monthly Reports' },
    { key: 'custom' as const, label: 'Custom Reports' }
  ]

  const handleGenerateReport = async (data: { clientId: string; type: string; periodStart: string; periodEnd: string }) => {
    try {
      await reportService.create({
        title: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Report`,
        type: 'custom' as const,
        clientId: data.clientId,
        dateRange: {
          start: data.periodStart,
          end: data.periodEnd
        },
        generatedBy: 'system', // Would be current user ID in production
        data: {}
      })

      showToast({ type: 'success', message: 'Report generated successfully' })

      // Reload reports list
      await loadReports()
      setIsGenerateModalOpen(false)
    } catch (err: any) {
      console.error('Failed to generate report:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to generate report' })
    }
  }

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleDownload = async (report: any) => {
    try {
      await reportService.download(report._id)
      showToast({ type: 'success', message: `Downloading ${report.reportType} report...` })
    } catch (err: any) {
      console.error('Failed to download report:', err)
      showToast({ type: 'error', message: 'Failed to download report' })
    }
  }

  const handleRegenerate = async (report: any) => {
    try {
      await reportService.create({
        title: report.title || 'Regenerated Report',
        type: report.type || 'custom',
        clientId: report.clientId,
        dateRange: report.dateRange || {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        generatedBy: 'system',
        data: report.data || {}
      })

      showToast({ type: 'success', message: 'Report regeneration started' })

      // Reload reports list
      await loadReports()
    } catch (err: any) {
      console.error('Failed to regenerate report:', err)
      showToast({ type: 'error', message: 'Failed to regenerate report' })
    }
  }

  // Convert API report to legacy Report format for modals
  const convertToLegacyReport = (apiReport: any | null): Report | null => {
    if (!apiReport) return null

    return {
      id: apiReport._id,
      name: `${apiReport.reportType.charAt(0).toUpperCase() + apiReport.reportType.slice(1)} Report`,
      clientId: apiReport.clientId,
      clientName: apiReport.clientId?.substring(0, 8) || 'Unknown',
      type: apiReport.reportType,
      periodStart: new Date(apiReport.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      periodEnd: new Date(apiReport.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: apiReport.status || 'generated',
      createdAt: new Date(apiReport.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      pdfUrl: apiReport.s3Key || '#'
    }
  }

  const columns = [
    {
      header: 'Report Name',
      accessor: (row: any) => (
        <div className="cursor-pointer" onClick={() => handleViewReport(row)}>
          <span className="font-semibold text-black">
            {row.reportType.charAt(0).toUpperCase() + row.reportType.slice(1)} Report
          </span>
        </div>
      )
    },
    {
      header: 'Client',
      accessor: (row: any) => (
        <span className="text-gray-600">{row.clientId?.substring(0, 8) || 'Unknown'}</span>
      ),
      className: 'text-gray-600'
    },
    {
      header: 'Period',
      accessor: (row: any) => (
        <span className="text-gray-600">
          {new Date(row.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}{' '}
          -{' '}
          {new Date(row.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      header: 'Type',
      accessor: (row: any) => (
        <span className="text-gray-600 capitalize">{row.reportType}</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => <Badge status={row.status || 'active'} />
    },
    {
      header: 'Created',
      accessor: (row: any) => (
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
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
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

  if (loading) {
    return <LoadingSpinner message="Loading reports..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadReports} />
  }

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
        report={convertToLegacyReport(selectedReport)}
      />
    </div>
  )
}
