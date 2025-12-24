import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-background overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
