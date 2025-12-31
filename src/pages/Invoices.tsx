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
import { InvoiceFormModal } from '../components/modals/InvoiceFormModal'
import { ViewInvoiceModal } from '../components/modals/ViewInvoiceModal'
import { MarkAsPaidModal } from '../components/modals/MarkAsPaidModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { Receipt, DollarSign, Clock, AlertCircle, Eye, Edit, CheckCircle, Trash2, ExternalLink, Plus } from 'lucide-react'
import { invoiceService, Invoice as APIInvoice, InvoiceStats } from '../services/invoiceService'
import { clientService } from '../services/clientService'
import type { Invoice } from '../types'

export const Invoices: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [invoices, setInvoices] = useState<APIInvoice[]>([])
  const [stats, setStats] = useState<InvoiceStats | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isMarkPaidModalOpen, setIsMarkPaidModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<APIInvoice | null>(null)
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null)

  // Load invoices on mount
  useEffect(() => {
    loadInvoices()
    loadClients()
  }, [])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      setError('')

      const [invoiceRes, statsRes] = await Promise.all([
        invoiceService.getAll(),
        invoiceService.getStats()
      ])

      setInvoices(invoiceRes.invoices)
      setStats(statsRes.stats)
    } catch (err: any) {
      console.error('Failed to load invoices:', err)
      setError(err.response?.data?.error || 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const response = await clientService.getAll()
      setClients(response.clients)
    } catch (err) {
      console.error('Failed to load clients:', err)
    }
  }

  const handleCreateInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      const createData = {
        clientId: invoiceData.clientId || '',
        vaId: '', // Would need to select VA in production
        amount: invoiceData.amount || 0,
        currency: 'USD',
        dueDate: invoiceData.dueDate || new Date().toISOString(),
        issueDate: new Date().toISOString(),
        status: 'draft' as const,
        lineItems: [{
          description: 'VA Services',
          quantity: 1,
          rate: invoiceData.amount || 0,
          amount: invoiceData.amount || 0
        }]
      }

      await invoiceService.create(createData)
      showToast({ type: 'success', message: 'Invoice created successfully' })

      // Reload invoices list
      await loadInvoices()
      setIsCreateModalOpen(false)
    } catch (err: any) {
      console.error('Failed to create invoice:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to create invoice' })
    }
  }

  const handleEditInvoice = async (invoiceData: Partial<Invoice>) => {
    if (!selectedInvoice) return

    try {
      const updateData = {
        amount: invoiceData.amount,
        dueDate: invoiceData.dueDate,
        status: invoiceData.status as any
      }

      await invoiceService.update(selectedInvoice._id, updateData)
      showToast({ type: 'success', message: 'Invoice updated successfully' })

      // Reload invoices list
      await loadInvoices()
      setIsEditModalOpen(false)
      setSelectedInvoice(null)
    } catch (err: any) {
      console.error('Failed to update invoice:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to update invoice' })
    }
  }

  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return

    try {
      await invoiceService.markAsPaid(selectedInvoice._id)
      showToast({ type: 'success', message: 'Invoice marked as paid' })

      // Reload invoices list
      await loadInvoices()
      setIsMarkPaidModalOpen(false)
      setSelectedInvoice(null)
    } catch (err: any) {
      console.error('Failed to mark invoice as paid:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to mark as paid' })
    }
  }

  const handleDeleteInvoice = async () => {
    if (!deleteInvoiceId) return

    try {
      await invoiceService.delete(deleteInvoiceId)
      showToast({ type: 'success', message: 'Invoice deleted successfully' })

      // Reload invoices list
      await loadInvoices()
      setDeleteInvoiceId(null)
    } catch (err: any) {
      console.error('Failed to delete invoice:', err)
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete invoice' })
    }
  }

  const handleViewInvoice = (invoice: APIInvoice) => {
    setSelectedInvoice(invoice)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (invoice: APIInvoice) => {
    setSelectedInvoice(invoice)
    setIsEditModalOpen(true)
  }

  const handleMarkPaidClick = (invoice: APIInvoice) => {
    setSelectedInvoice(invoice)
    setIsMarkPaidModalOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  // Convert API invoice to legacy Invoice format for modals
  const convertToLegacyInvoice = (apiInvoice: APIInvoice | null): Invoice | undefined => {
    if (!apiInvoice) return undefined

    return {
      id: apiInvoice._id,
      invoiceNumber: apiInvoice.invoiceNumber,
      clientId: apiInvoice.clientId,
      clientName: apiInvoice.clientId, // Would need to fetch client name
      amount: apiInvoice.amount,
      currency: apiInvoice.currency,
      dueDate: new Date(apiInvoice.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: apiInvoice.status === 'paid' ? 'paid' : apiInvoice.status === 'overdue' ? 'overdue' : 'unpaid',
      pdfUrl: '#',
      createdAt: new Date(apiInvoice.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  const columns = [
    {
      header: 'Invoice #',
      accessor: (row: APIInvoice) => (
        <div className="cursor-pointer" onClick={() => handleViewInvoice(row)}>
          <span className="font-semibold text-primary">{row.invoiceNumber}</span>
        </div>
      )
    },
    {
      header: 'Client',
      accessor: (row: APIInvoice) => (
        <span className="text-gray-600">{row.clientId.substring(0, 8)}...</span>
      ),
      className: 'text-gray-600'
    },
    {
      header: 'Amount',
      accessor: (row: APIInvoice) => (
        <span className="font-semibold text-black">
          ${row.amount.toLocaleString()} {row.currency}
        </span>
      )
    },
    {
      header: 'Due Date',
      accessor: (row: APIInvoice) => (
        <span className="text-gray-600">
          {new Date(row.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      className: 'text-gray-600'
    },
    {
      header: 'Status',
      accessor: (row: APIInvoice) => (
        <Badge status={row.status === 'paid' ? 'active' : row.status === 'overdue' ? 'inactive' : 'pending'} />
      )
    },
    {
      header: 'Actions',
      accessor: (row: APIInvoice) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewInvoice(row) }}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          {row.status !== 'paid' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleEditClick(row) }}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {row.status !== 'paid' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleMarkPaidClick(row) }}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              title="Mark as Paid"
            >
              <CheckCircle className="w-4 h-4 text-success" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteInvoiceId(row._id) }}
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
    return <LoadingSpinner message="Loading invoices..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadInvoices} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Invoices"
          subtitle="Manage invoices and payments"
          actions={
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard
            icon={Receipt}
            label="Total"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          />
          <StatCard
            icon={DollarSign}
            label="Paid"
            value={`$${(stats?.totalPaid || 0).toLocaleString()}`}
            accent
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={`$${(stats?.totalPending || 0).toLocaleString()}`}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={`$${(stats?.totalOverdue || 0).toLocaleString()}`}
          />
        </div>

        <Card className="h-[calc(100vh-280px)] flex flex-col">
          <h2 className="text-xl font-bold font-serif text-black mb-4 flex-shrink-0">
            All Invoices
          </h2>
          <div className="flex-1 overflow-y-auto">
            {invoices.length > 0 ? (
              <Table columns={columns} data={invoices} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No invoices found</p>
                <p className="text-gray-400 text-sm mt-2">Create a new invoice to get started</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <InvoiceFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
        mode="create"
      />

      <InvoiceFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedInvoice(null)
        }}
        onSubmit={handleEditInvoice}
        invoice={convertToLegacyInvoice(selectedInvoice)}
        mode="edit"
      />

      <ViewInvoiceModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedInvoice(null)
        }}
        invoice={convertToLegacyInvoice(selectedInvoice) || null}
        onEdit={handleEditFromView}
      />

      <MarkAsPaidModal
        isOpen={isMarkPaidModalOpen}
        onClose={() => {
          setIsMarkPaidModalOpen(false)
          setSelectedInvoice(null)
        }}
        onConfirm={handleMarkAsPaid}
        invoice={convertToLegacyInvoice(selectedInvoice) || null}
      />

      <ConfirmationModal
        isOpen={deleteInvoiceId !== null}
        onClose={() => setDeleteInvoiceId(null)}
        onConfirm={handleDeleteInvoice}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
