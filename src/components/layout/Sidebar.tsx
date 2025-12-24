import React from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  Briefcase
} from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  section?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, section: 'MAIN' },
  { label: 'Client Portal', path: '/client-portal', icon: Briefcase },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Clients', path: '/clients', icon: Building2 },
  { label: 'Virtual Assistants', path: '/virtual-assistants', icon: UserCheck },
  { label: 'Reports', path: '/reports', icon: FileText, section: 'MANAGEMENT' },
  { label: 'Invoices', path: '/invoices', icon: Receipt },
  { label: 'Documents', path: '/documents', icon: FolderOpen },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings, section: 'SYSTEM' },
  { label: 'Notifications', path: '/notifications', icon: Bell }
]

export const Sidebar: React.FC = () => {
  const location = useLocation()

  const renderNavItems = () => {
    let currentSection = ''

    return navItems.map((item) => {
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

  return (
    <div className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl font-bold font-serif text-primary">
          The Human Capital
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {renderNavItems()}
      </nav>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
            PA
          </div>
          <div className="flex-1">
            <p className="font-semibold text-black text-sm">Piyoosh Admin</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
