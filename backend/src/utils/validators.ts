import { body, param, query } from 'express-validator';

// Auth validators
export const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['client', 'va', 'admin']).withMessage('Invalid role')
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Client validators
export const createClientValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('locationState').trim().notEmpty().withMessage('Location state is required'),
  body('calculatedHourlyValue').isFloat({ min: 0 }).withMessage('Calculated hourly value must be positive'),
  body('dataSource').trim().notEmpty().withMessage('Data source is required'),
  body('confidenceLevel').isIn(['high', 'medium', 'low']).withMessage('Invalid confidence level'),
  body('baselineAdminHoursPerWeek').optional().isFloat({ min: 0 }).withMessage('Baseline hours must be positive')
];

// VA validators
export const createVAValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('department').isIn(['Marketing', 'Accounting', 'Admin', 'Customer Support', 'Operations', 'Other']).withMessage('Invalid department'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be positive')
];

// TimeLog validators
export const createTimeLogValidator = [
  body('vaId').isMongoId().withMessage('Invalid VA ID'),
  body('clientId').isMongoId().withMessage('Invalid client ID'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('hoursWorked').isFloat({ min: 0.01, max: 24 }).withMessage('Hours worked must be between 0.01 and 24'),
  body('tasksCompleted').optional().isInt({ min: 0 }).withMessage('Tasks completed must be non-negative')
];

// Invoice validators
export const createInvoiceValidator = [
  body('clientId').isMongoId().withMessage('Invalid client ID'),
  body('dueDate').isISO8601().withMessage('Invalid due date format'),
  body('lineItems').isArray({ min: 1 }).withMessage('At least one line item is required'),
  body('lineItems.*.description').trim().notEmpty().withMessage('Line item description is required'),
  body('lineItems.*.quantity').isFloat({ min: 0 }).withMessage('Quantity must be non-negative'),
  body('lineItems.*.rate').isFloat({ min: 0 }).withMessage('Rate must be non-negative'),
  body('lineItems.*.amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative')
];

// Report validators
export const createReportValidator = [
  body('clientId').isMongoId().withMessage('Invalid client ID'),
  body('type').isIn(['weekly', 'monthly', 'custom']).withMessage('Invalid report type'),
  body('periodStart').isISO8601().withMessage('Invalid period start date'),
  body('periodEnd').isISO8601().withMessage('Invalid period end date')
];

// Feedback validators
export const createFeedbackValidator = [
  body('vaId').isMongoId().withMessage('Invalid VA ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// ID param validator
export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

// Pagination validators
export const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
