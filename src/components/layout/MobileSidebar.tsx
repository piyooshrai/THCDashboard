import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  FileText,
  Receipt,
  FolderOpen,
  BarChart3,
  Settings,
  Bell,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  section?: string
  roles?: string[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, section: 'MAIN' },
  { label: 'Users', path: '/users', icon: Users, roles: ['admin'] },
  { label: 'Clients', path: '/clients', icon: Building2, roles: ['admin'] },
  { label: 'Virtual Assistants', path: '/virtual-assistants', icon: UserCheck, roles: ['admin'] },
  { label: 'My Clients', path: '/my-clients', icon: Building2, roles: ['va'], section: 'MY WORK' },
  { label: 'Time Tracking', path: '/time-tracking', icon: BarChart3, roles: ['va'] },
  { label: 'Documents', path: '/documents', icon: FolderOpen, roles: ['va'] },
  { label: 'My VA', path: '/my-va', icon: UserCheck, roles: ['client'], section: 'MY ACCOUNT' },
  { label: 'Reports', path: '/reports', icon: FileText, roles: ['admin', 'client'], section: 'MANAGEMENT' },
  { label: 'Invoices', path: '/invoices', icon: Receipt, roles: ['admin', 'client'] },
  { label: 'Documents', path: '/documents', icon: FolderOpen, roles: ['admin', 'client'] },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin'] },
  { label: 'Settings', path: '/settings', icon: Settings, section: 'SYSTEM' },
  { label: 'Notifications', path: '/notifications', icon: Bell }
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const renderNavItems = () => {
    let currentSection = ''
    const userRole = user?.role || 'client'

    const filteredItems = navItems.filter(item => {
      if (!item.roles) return true
      return item.roles.includes(userRole)
    })

    return filteredItems.map((item) => {
      const isActive = location.pathname === item.path
      const Icon = item.icon
      const showSection = item.section && item.section !== currentSection

      if (item.section) {
        currentSection = item.section
      }

      return (
        <React.Fragment key={item.path}>
          {showSection && (
            <div className="px-6 pt-6 pb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {item.section}
              </p>
            </div>
          )}
          <Link
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-6 py-3 mx-3 rounded-lg transition-all ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-background hover:text-primary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        </React.Fragment>
      )
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-200 flex flex-col z-50 lg:hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <img
            src="/THC Transparent Logo.png"
            alt="The Human Capital"
            className="h-12 w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {renderNavItems()}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-black text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
