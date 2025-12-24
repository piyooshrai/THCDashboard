import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ToastProvider } from './components/common/Toast'
import { Dashboard } from './pages/Dashboard'
import { Users } from './pages/Users'
import { Clients } from './pages/Clients'
import { VirtualAssistants } from './pages/VirtualAssistants'
import { Reports } from './pages/Reports'
import { Invoices } from './pages/Invoices'
import { Documents } from './pages/Documents'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Notifications } from './pages/Notifications'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/virtual-assistants" element={<VirtualAssistants />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
