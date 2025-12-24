import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  trend?: string
  trendPositive?: boolean
  accent?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  trend,
  trendPositive,
  accent = false
}) => {
  return (
    <div
      className={`stat-card ${
        accent ? 'bg-accent text-white' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${accent ? 'text-white/90' : 'text-gray-500'}`}>
            {label}
          </p>
          <h3 className={`text-4xl font-bold font-serif mb-2 ${accent ? 'text-white' : 'text-black'}`}>
            {value}
          </h3>
          {trend && (
            <p className={`text-sm font-medium ${
              accent
                ? 'text-white/90'
                : trendPositive
                  ? 'text-success'
                  : 'text-error'
            }`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${accent ? 'bg-white/20' : 'bg-background'}`}>
          <Icon className={`w-6 h-6 ${accent ? 'text-white' : 'text-primary'}`} />
        </div>
      </div>
    </div>
  )
}
