import React from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import type { User } from '../../types'

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  user: User | null
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  user
}) => {
  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onEdit}>
            Edit User
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl">
            {user.avatar}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
            <p className="text-base font-semibold text-black capitalize">
              {user.role === 'va' ? 'Virtual Assistant' : user.role}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <Badge status={user.status} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Joined Date</p>
            <p className="text-base font-semibold text-black">{user.joined}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Last Active</p>
            <p className="text-base font-semibold text-black">2 hours ago</p>
          </div>
        </div>

        {user.role === 'client' && (
          <div className="bg-background p-4 rounded-lg">
            <h4 className="font-semibold text-black mb-3">Client Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">ROI</p>
                <p className="text-lg font-bold text-success">385%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hours Reclaimed</p>
                <p className="text-lg font-bold text-primary">156h</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'va' && (
          <div className="bg-background p-4 rounded-lg">
            <h4 className="font-semibold text-black mb-3">VA Stats</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Active Clients</p>
                <p className="text-lg font-bold text-primary">3</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hours This Month</p>
                <p className="text-lg font-bold text-primary">140h</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Rating</p>
                <p className="text-lg font-bold text-success">4.9</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
