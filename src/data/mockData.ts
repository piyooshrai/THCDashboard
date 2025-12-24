import type {
  User,
  Client,
  VA,
  Invoice,
  Report,
  Document,
  Notification,
  Activity,
  FileItem,
  StatCardData,
  Analytics,
  ROITrendData,
  ClientROIData
} from '../types'

export const mockStats = {
  totalUsers: { value: 247, trend: '+12%', positive: true } as StatCardData,
  activeClients: { value: 89, trend: '+8%', positive: true } as StatCardData,
  tasksThisMonth: { value: 1284, trend: '+24%', positive: true } as StatCardData,
  revenue: { value: '$124k', trend: '+18%', positive: true } as StatCardData
}

export const mockRecentUsers: User[] = [
  { id: '1', name: 'Sarah Anderson', email: 'sarah@example.com', role: 'va', status: 'active', joined: 'Dec 15, 2024', avatar: 'SA' },
  { id: '2', name: 'Mike Kumar', email: 'mike@example.com', role: 'client', status: 'active', joined: 'Dec 12, 2024', avatar: 'MK' },
  { id: '3', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'pending', joined: 'Dec 10, 2024', avatar: 'JD' },
  { id: '4', name: 'Lisa Smith', email: 'lisa@example.com', role: 'va', status: 'active', joined: 'Dec 8, 2024', avatar: 'LS' }
]

export const mockRecentActivity: Activity[] = [
  { id: 1, icon: 'FileText', title: 'New report submitted', description: 'Sarah Anderson submitted weekly report', time: '5 minutes ago' },
  { id: 2, icon: 'Users', title: 'New user registered', description: 'John Doe signed up as a client', time: '1 hour ago' },
  { id: 3, icon: 'DollarSign', title: 'Invoice paid', description: 'Mike Kumar paid invoice #1234', time: '3 hours ago' },
  { id: 4, icon: 'CheckCircle', title: 'Task completed', description: 'Marketing dashboard updated', time: '5 hours ago' }
]

export const mockFiles: FileItem[] = [
  { id: 1, name: 'Q4_Financial_Report.pdf', size: '2.4 MB', uploadedAt: '2 hours ago', type: 'pdf' },
  { id: 2, name: 'Client_Database.xlsx', size: '1.8 MB', uploadedAt: 'yesterday', type: 'xlsx' },
  { id: 3, name: 'Contract_Template.docx', size: '156 KB', uploadedAt: '3 days ago', type: 'docx' }
]

export const mockUsers: User[] = [
  { id: '1', name: 'Sarah Anderson', email: 'sarah@example.com', role: 'va', status: 'active', joined: '2024-12-15', avatar: 'SA' },
  { id: '2', name: 'Mike Kumar', email: 'mike@example.com', role: 'client', status: 'active', joined: '2024-12-12', avatar: 'MK' },
  { id: '3', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'pending', joined: '2024-12-10', avatar: 'JD' },
  { id: '4', name: 'Lisa Smith', email: 'lisa@example.com', role: 'va', status: 'active', joined: '2024-12-08', avatar: 'LS' },
  { id: '5', name: 'Robert Chen', email: 'robert@example.com', role: 'client', status: 'active', joined: '2024-12-05', avatar: 'RC' },
  { id: '6', name: 'Emily Rodriguez', email: 'emily@example.com', role: 'va', status: 'active', joined: '2024-12-01', avatar: 'ER' },
  { id: '7', name: 'David Park', email: 'david@example.com', role: 'admin', status: 'active', joined: '2024-11-28', avatar: 'DP' },
  { id: '8', name: 'Jennifer Wu', email: 'jennifer@example.com', role: 'client', status: 'inactive', joined: '2024-11-25', avatar: 'JW' }
]

export const mockClients: Client[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Doe Real Estate', industry: 'Real Estate', jobTitle: 'Real Estate Agent', location: 'Denver, CO', hourlyValue: 55, baselineHours: 15, hoursReclaimed: 156, vaHoursWorked: 140, roi: 402, status: 'active', avatar: 'JD' },
  { id: '2', name: 'Mike Kumar', email: 'mike@example.com', company: 'Kumar Consulting', industry: 'Consulting', jobTitle: 'CEO', location: 'San Francisco, CA', hourlyValue: 125, baselineHours: 20, hoursReclaimed: 208, vaHoursWorked: 160, roi: 520, status: 'active', avatar: 'MK' },
  { id: '3', name: 'Robert Chen', email: 'robert@example.com', company: 'Chen Medical Group', industry: 'Healthcare', jobTitle: 'Healthcare Administrator', location: 'Boston, MA', hourlyValue: 60, baselineHours: 12, hoursReclaimed: 104, vaHoursWorked: 96, roi: 280, status: 'active', avatar: 'RC' },
  { id: '4', name: 'Jennifer Wu', email: 'jennifer@example.com', company: 'Wu Financial Advisors', industry: 'Finance', jobTitle: 'Financial Advisor', location: 'New York, NY', hourlyValue: 65, baselineHours: 18, hoursReclaimed: 187, vaHoursWorked: 150, roi: 345, status: 'inactive', avatar: 'JW' }
]

export const mockVAs: VA[] = [
  { id: '1', name: 'Sarah Anderson', email: 'sarah@example.com', department: 'Marketing', activeClients: 3, hoursThisMonth: 140, avgRating: 4.9, status: 'active', avatar: 'SA' },
  { id: '2', name: 'Lisa Smith', email: 'lisa@example.com', department: 'Accounting', activeClients: 2, hoursThisMonth: 120, avgRating: 4.8, status: 'active', avatar: 'LS' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily@example.com', department: 'Admin', activeClients: 4, hoursThisMonth: 160, avgRating: 4.7, status: 'active', avatar: 'ER' },
  { id: '4', name: 'Maria Garcia', email: 'maria@example.com', department: 'Customer Support', activeClients: 2, hoursThisMonth: 100, avgRating: 5.0, status: 'active', avatar: 'MG' }
]

export const mockReports: Report[] = [
  { id: '1', name: 'Weekly Report - John Doe', clientId: '1', clientName: 'John Doe', type: 'weekly', periodStart: '2024-12-16', periodEnd: '2024-12-22', status: 'generated', createdAt: '2024-12-23', pdfUrl: '#' },
  { id: '2', name: 'Monthly Report - Mike Kumar', clientId: '2', clientName: 'Mike Kumar', type: 'monthly', periodStart: '2024-11-01', periodEnd: '2024-11-30', status: 'generated', createdAt: '2024-12-01', pdfUrl: '#' },
  { id: '3', name: 'Weekly Report - Robert Chen', clientId: '3', clientName: 'Robert Chen', type: 'weekly', periodStart: '2024-12-16', periodEnd: '2024-12-22', status: 'pending', createdAt: '2024-12-23', pdfUrl: undefined },
  { id: '4', name: 'Custom Report - Jennifer Wu', clientId: '4', clientName: 'Jennifer Wu', type: 'custom', periodStart: '2024-10-01', periodEnd: '2024-12-22', status: 'generated', createdAt: '2024-12-22', pdfUrl: '#' }
]

export const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', clientId: '1', clientName: 'John Doe', amount: 2400, currency: 'USD', dueDate: '2025-01-15', status: 'unpaid', pdfUrl: '#', zohoPaymentUrl: 'https://invoice.zoho.com/example1', createdAt: '2024-12-23' },
  { id: '2', invoiceNumber: 'INV-2024-002', clientId: '2', clientName: 'Mike Kumar', amount: 3600, currency: 'USD', dueDate: '2025-01-10', status: 'paid', pdfUrl: '#', zohoPaymentUrl: 'https://invoice.zoho.com/example2', paidAt: '2024-12-20', createdAt: '2024-12-10' },
  { id: '3', invoiceNumber: 'INV-2024-003', clientId: '3', clientName: 'Robert Chen', amount: 2880, currency: 'USD', dueDate: '2024-12-20', status: 'overdue', pdfUrl: '#', zohoPaymentUrl: 'https://invoice.zoho.com/example3', createdAt: '2024-12-01' },
  { id: '4', invoiceNumber: 'INV-2024-004', clientId: '4', clientName: 'Jennifer Wu', amount: 4200, currency: 'USD', dueDate: '2025-01-20', status: 'unpaid', pdfUrl: '#', zohoPaymentUrl: undefined, createdAt: '2024-12-22' }
]

export const mockDocuments: Document[] = [
  { id: '1', fileName: 'Q4_Financial_Report.pdf', fileType: 'pdf', size: '2.4 MB', uploadedBy: 'Admin', uploadedByAvatar: 'AD', clientId: '1', clientName: 'John Doe', uploadedAt: '2024-12-23 10:30', s3Key: 'documents/abc123.pdf' },
  { id: '2', fileName: 'Client_Database.xlsx', fileType: 'xlsx', size: '1.8 MB', uploadedBy: 'Admin', uploadedByAvatar: 'AD', clientId: undefined, clientName: undefined, uploadedAt: '2024-12-22 14:15', s3Key: 'documents/def456.xlsx' },
  { id: '3', fileName: 'Contract_Template.docx', fileType: 'docx', size: '156 KB', uploadedBy: 'Sarah Anderson', uploadedByAvatar: 'SA', clientId: '2', clientName: 'Mike Kumar', uploadedAt: '2024-12-20 09:45', s3Key: 'documents/ghi789.docx' },
  { id: '4', fileName: 'Invoice_INV-2024-001.pdf', fileType: 'pdf', size: '245 KB', uploadedBy: 'Admin', uploadedByAvatar: 'AD', clientId: '1', clientName: 'John Doe', uploadedAt: '2024-12-23 11:00', s3Key: 'invoices/jkl012.pdf' }
]

export const mockNotifications: Notification[] = [
  { id: '1', type: 'invoice', icon: 'DollarSign', title: 'Invoice Payment Received', description: 'Mike Kumar paid invoice #INV-2024-002', time: '5 minutes ago', read: false, createdAt: '2024-12-23T10:55:00' },
  { id: '2', type: 'report', icon: 'FileText', title: 'Weekly Report Generated', description: 'Report for John Doe is ready', time: '1 hour ago', read: false, createdAt: '2024-12-23T09:30:00' },
  { id: '3', type: 'user', icon: 'Users', title: 'New User Registration', description: 'Emma Thompson signed up as a client', time: '3 hours ago', read: true, createdAt: '2024-12-23T07:30:00' },
  { id: '4', type: 'reminder', icon: 'Bell', title: 'Invoice Reminder', description: 'Invoice #INV-2024-003 is overdue', time: 'Yesterday', read: true, createdAt: '2024-12-22T14:00:00' },
  { id: '5', type: 'system', icon: 'AlertCircle', title: 'System Update', description: 'New features added to analytics dashboard', time: '2 days ago', read: true, createdAt: '2024-12-21T10:00:00' }
]

export const mockAnalytics: Analytics = {
  totalHoursReclaimed: 1247,
  totalValueReclaimed: 124700,
  totalVACost: 28800,
  netSavings: 95900,
  avgROI: 385
}

export const mockROITrend: ROITrendData[] = [
  { month: 'Jul', roi: 320 },
  { month: 'Aug', roi: 340 },
  { month: 'Sep', roi: 365 },
  { month: 'Oct', roi: 375 },
  { month: 'Nov', roi: 380 },
  { month: 'Dec', roi: 385 }
]

export const mockClientROI: ClientROIData[] = [
  { client: 'Mike Kumar', roi: 520, hours: 208 },
  { client: 'John Doe', roi: 402, hours: 156 },
  { client: 'Jennifer Wu', roi: 345, hours: 187 },
  { client: 'Robert Chen', roi: 280, hours: 104 }
]
