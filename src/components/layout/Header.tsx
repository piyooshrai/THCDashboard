import React from 'react'
import { Search } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showSearch?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  showSearch = false
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-6xl font-bold font-serif text-black mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="input pl-12 w-80"
              />
            </div>
          )}
          {actions}
        </div>
      </div>
    </div>
  )
}
