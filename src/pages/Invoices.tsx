import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { InvoiceFormModal } from '../components/modals/InvoiceFormModal'
import { ViewInvoiceModal } from '../components/modals/ViewInvoiceModal'
import { MarkAsPaidModal } from '../components/modals/MarkAsPaidModal'
import { ConfirmationModal } from '../components/modals/ConfirmationModal'
import { Receipt, DollarSign, Clock, AlertCircle, Eye, Edit, CheckCircle, Trash2, ExternalLink, Plus } from 'lucide-react'
import { mockInvoices, mockClients } from '../data/mockData'
import type { Invoice } from '../types'

export const Invoices: React.FC = () => {
  const { showToast } = useToast()
  const [invoices, setInvoices] = useState(mockInvoices)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isMarkPaidModalOpen, setIsMarkPaidModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null)

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const handleCreateInvoice = (invoiceData: Partial<Invoice>) => {
    console.log('Creating invoice:', invoiceData)
    const client = mockClients.find(c => c.id === invoiceData.clientId)
    const newInvoice: Invoice = {
      id: (invoices.length + 1).toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: invoiceData.clientId || '',
      clientName: client?.name || '',
      amount: invoiceData.amount || 0,
      currency: 'USD',
      dueDate: invoiceData.dueDate || '',
      status: 'unpaid',
      pdfUrl: '#',
      zohoPaymentUrl: invoiceData.zohoPaymentUrl,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    setInvoices([newInvoice, ...invoices])
    showToast({ type: 'success', message: 'Invoice created successfully' })
  }

  const handleEditInvoice = (invoiceData: Partial<Invoice>) => {
    if (!selectedInvoice) return
    console.log('Editing invoice:', selectedInvoice.id, invoiceData)
    const client = mockClients.find(c => c.id === invoiceData.clientId)
    setInvoices(invoices.map(inv =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            clientId: invoiceData.clientId || inv.clientId,
            clientName: client?.name || inv.clientName,
            amount: invoiceData.amount || inv.amount,
            dueDate: invoiceData.dueDate || inv.dueDate,
            zohoPaymentUrl: invoiceData.zohoPaymentUrl
          }
        : inv
    ))
    showToast({ type: 'success', message: 'Invoice updated successfully' })
    setSelectedInvoice(null)
  }

  const handleMarkAsPaid = () => {
    if (!selectedInvoice) return
    console.log('Marking invoice as paid:', selectedInvoice.id)
    setInvoices(
      invoices.map(inv =>
        inv.id === selectedInvoice.id
          ? { ...inv, status: 'paid' as const, paidAt: new Date().toISOString() }
          : inv
      )
    )
    showToast({ type: 'success', message: 'Invoice marked as paid' })
    setSelectedInvoice(null)
  }

  const handleDeleteInvoice = () => {
    if (!deleteInvoiceId) return
    console.log('Deleting invoice:', deleteInvoiceId)
    setInvoices(invoices.filter(inv => inv.id !== deleteInvoiceId))
    showToast({ type: 'success', message: 'Invoice deleted successfully' })
    setDeleteInvoiceId(null)
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsEditModalOpen(true)
  }

  const handleMarkPaidClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsMarkPaidModalOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const columns = [
    {
      header: 'Invoice #',
      accessor: (row: Invoice) => (
        <div className="cursor-pointer" onClick={() => handleViewInvoice(row)}>
          <span className="font-semibold text-primary">{row.invoiceNumber}</span>
        </div>
      )
    },
    {
      header: 'Client',
      accessor: 'clientName' as keyof Invoice,
      className: 'text-gray-600'
    },
    {
      header: 'Amount',
      accessor: (row: Invoice) => (
        <span className="font-semibold text-black">
          ${row.amount.toLocaleString()} {row.currency}
        </span>
      )
    },
    {
      header: 'Due Date',
      accessor: 'dueDate' as keyof Invoice,
      className: 'text-gray-600'
    },
    {
      header: 'Status',
      accessor: (row: Invoice) => <Badge status={row.status} />
    },
    {
      header: 'Payment Link',
      accessor: (row: Invoice) => (
        row.zohoPaymentUrl ? (
          <a
            href={row.zohoPaymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-gray-400 text-sm">No link</span>
        )
      )
    },
    {
      header: 'Actions',
      accessor: (row: Invoice) => (
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
            onClick={(e) => { e.stopPropagation(); setDeleteInvoiceId(row.id) }}
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
            value={`$${totalAmount.toLocaleString()}`}
          />
          <StatCard
            icon={DollarSign}
            label="Paid"
            value={`$${paidAmount.toLocaleString()}`}
            accent
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={`$${pendingAmount.toLocaleString()}`}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={`$${overdueAmount.toLocaleString()}`}
          />
        </div>

        <Card className="h-[calc(100vh-280px)] flex flex-col">
          <h2 className="text-xl font-bold font-serif text-black mb-4 flex-shrink-0">
            All Invoices
          </h2>
          <div className="flex-1 overflow-y-auto">
            <Table columns={columns} data={invoices} />
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
        invoice={selectedInvoice || undefined}
        mode="edit"
      />

      <ViewInvoiceModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedInvoice(null)
        }}
        invoice={selectedInvoice}
        onEdit={handleEditFromView}
      />

      <MarkAsPaidModal
        isOpen={isMarkPaidModalOpen}
        onClose={() => {
          setIsMarkPaidModalOpen(false)
          setSelectedInvoice(null)
        }}
        onConfirm={handleMarkAsPaid}
        invoice={selectedInvoice}
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
