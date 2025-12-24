import React from 'react'

type BadgeStatus = 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid' | 'overdue' | 'generated'

interface BadgeProps {
  status: BadgeStatus
  text?: string
}

export const Badge: React.FC<BadgeProps> = ({ status, text }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'generated':
        return 'bg-success/10 text-success border-success/20'
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'pending':
      case 'unpaid':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'overdue':
        return 'bg-error/10 text-error border-error/20'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusStyles()}`}
    >
      {text || status}
    </span>
  )
}
