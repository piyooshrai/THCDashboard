export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  VA: 'va'
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
} as const;

export const INVOICE_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
} as const;

export const REPORT_STATUS = {
  PENDING: 'pending',
  GENERATED: 'generated',
  FAILED: 'failed'
} as const;

export const REPORT_TYPES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom'
} as const;

export const DEPARTMENTS = [
  'Marketing',
  'Accounting',
  'Admin',
  'Customer Support',
  'Operations',
  'Other'
] as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/jpg'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
