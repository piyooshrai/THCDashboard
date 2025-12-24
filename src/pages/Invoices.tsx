import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Receipt, DollarSign, Clock, AlertCircle, Eye, Edit, CheckCircle, Trash2, ExternalLink } from 'lucide-react'
import { mockInvoices } from '../data/mockData'
import type { Invoice } from '../types'

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState(mockInvoices)

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

  const handleMarkAsPaid = (invoiceId: string) => {
    console.log('Marking invoice as paid:', invoiceId)
    setInvoices(
      invoices.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: 'paid' as const, paidAt: new Date().toISOString() }
          : inv
      )
    )
  }

  const columns = [
    {
      header: 'Invoice #',
      accessor: (row: Invoice) => (
        <span className="font-semibold text-primary">{row.invoiceNumber}</span>
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
            onClick={() => console.log('View invoice:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Edit invoice:', row.id)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          {row.status !== 'paid' && (
            <button
              onClick={() => handleMarkAsPaid(row.id)}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              title="Mark as Paid"
            >
              <CheckCircle className="w-4 h-4 text-success" />
            </button>
          )}
          <button
            onClick={() => console.log('Delete invoice:', row.id)}
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
        title="Invoices"
        subtitle="Manage invoices and payments"
        actions={
          <Button variant="primary">Create Invoice</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <Card>
        <h2 className="text-2xl font-bold font-serif text-black mb-6">
          All Invoices
        </h2>
        <Table columns={columns} data={invoices} />
      </Card>
    </>
  )
}
