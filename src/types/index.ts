export interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'va' | 'admin'
  status: 'active' | 'inactive' | 'pending'
  joined: string
  avatar: string
}

export interface Client {
  id: string
  name: string
  email: string
  company: string
  industry: string
  jobTitle: string
  location: string
  hourlyValue: number
  baselineHours: number
  hoursReclaimed: number
  vaHoursWorked: number
  roi: number
  status: 'active' | 'inactive'
  avatar: string
}

export interface VA {
  id: string
  name: string
  email: string
  department: string
  activeClients: number
  hoursThisMonth: number
  avgRating: number
  status: 'active' | 'inactive'
  avatar: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  amount: number
  currency: string
  dueDate: string
  status: 'paid' | 'unpaid' | 'overdue'
  pdfUrl?: string
  zohoPaymentUrl?: string
  paidAt?: string
  createdAt: string
}

export interface Report {
  id: string
  name: string
  clientId: string
  clientName: string
  type: 'weekly' | 'monthly' | 'custom'
  periodStart: string
  periodEnd: string
  status: 'generated' | 'pending'
  createdAt: string
  pdfUrl?: string
}

export interface Document {
  id: string
  fileName: string
  fileType: string
  size: string
  uploadedBy: string
  uploadedByAvatar: string
  clientId?: string
  clientName?: string
  uploadedAt: string
  s3Key: string
}

export interface Notification {
  id: string
  type: string
  icon: string
  title: string
  description: string
  time: string
  read: boolean
  createdAt: string
}

export interface Activity {
  id: number
  icon: string
  title: string
  description: string
  time: string
}

export interface FileItem {
  id: number
  name: string
  size: string
  uploadedAt: string
  type: string
}

export interface StatCardData {
  value: string | number
  trend: string
  positive: boolean
}

export interface Analytics {
  totalHoursReclaimed: number
  totalValueReclaimed: number
  totalVACost: number
  netSavings: number
  avgROI: number
}

export interface ROITrendData {
  month: string
  roi: number
}

export interface ClientROIData {
  client: string
  roi: number
  hours: number
}
