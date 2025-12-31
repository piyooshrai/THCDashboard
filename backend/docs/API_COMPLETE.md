# The Human Capital - Complete API Reference

Base URL: `http://localhost:5000/api/v1`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require Bearer token authentication.

**Header Format:**
```
Authorization: Bearer <your-jwt-token>
```

---

## Health Check

### GET /health
Check API server status.

**Auth Required:** No

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```

**cURL:**
```bash
curl http://localhost:5000/api/v1/health
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "role": "client|va|admin",
  "name": "John Doe",
  "industry": "Technology",
  "jobTitle": "CEO",
  "locationState": "California",
  "companyRevenueRange": "$1M-$5M"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": { "_id": "...", "email": "...", "role": "..." },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "role": "client",
    "name": "Test User",
    "industry": "Technology",
    "jobTitle": "CEO",
    "locationState": "California"
  }'
```

### POST /auth/login
Login existing user.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { "_id": "...", "email": "...", "role": "..." },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### GET /auth/profile
Get current user profile.

**Auth Required:** Yes
**Roles:** Any

**Response (200):**
```json
{
  "user": { "_id": "...", "email": "...", "role": "..." },
  "profile": { "_id": "...", "name": "...", ...additional fields }
}
```

### POST /auth/refresh-token
Refresh authentication token.

**Auth Required:** No

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/logout
Logout (client-side token removal).

**Auth Required:** Yes
**Roles:** Any

---

## User Management

### GET /users
List all users (paginated).

**Auth Required:** Yes
**Roles:** admin

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `role` (string, optional: client|va|admin)
- `status` (string, optional: active|inactive|pending)

**Response (200):**
```json
{
  "data": [...users],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**cURL:**
```bash
curl http://localhost:5000/api/v1/users?page=1&limit=10 \
  -H "Authorization: Bearer $TOKEN"
```

### GET /users/:id
Get specific user by ID.

**Auth Required:** Yes
**Roles:** admin

**Response (200):**
```json
{
  "_id": "...",
  "email": "...",
  "role": "...",
  "status": "...",
  "createdAt": "..."
}
```

### PUT /users/:id
Update user.

**Auth Required:** Yes
**Roles:** admin

**Request Body:**
```json
{
  "status": "active|inactive|pending",
  "role": "client|va|admin"
}
```

### DELETE /users/:id
Delete user.

**Auth Required:** Yes
**Roles:** admin

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

### PATCH /users/:id/toggle-status
Toggle user status between active/inactive.

**Auth Required:** Yes
**Roles:** admin

---

## Client Management

### GET /clients
List all clients.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `industry`, `locationState`

**Response (200):** Paginated list of clients

### POST /clients
Create new client.

**Auth Required:** Yes
**Roles:** admin

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "Password123!",
  "name": "John Smith",
  "company": "Smith Corp",
  "industry": "Real Estate",
  "jobTitle": "Real Estate Agent",
  "locationState": "California",
  "companyRevenueRange": "$1M-$5M",
  "baselineAdminHoursPerWeek": 15
}
```

### GET /clients/:id
Get specific client.

**Auth Required:** Yes
**Roles:** Any

### PUT /clients/:id
Update client.

**Auth Required:** Yes
**Roles:** admin, client (own profile)

### DELETE /clients/:id
Delete client.

**Auth Required:** Yes
**Roles:** admin

### GET /clients/:id/roi
Calculate client ROI.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `timeframe` (string: weekly|monthly|yearly, default: monthly)

**Response (200):**
```json
{
  "timeframe": "monthly",
  "clientHourlyValue": 100,
  "hoursReclaimed": 86.6,
  "valueOfReclaimedTime": 8660,
  "vaHoursWorked": 40,
  "vaCost": 2400,
  "netSavings": 6260,
  "roiPercentage": 260.83,
  "dataSources": ["BLS_2024"],
  "calculationDate": "2025-01-01T00:00:00.000Z"
}
```

### POST /clients/:id/recalculate-hourly-value
Recalculate client's hourly value.

**Auth Required:** Yes
**Roles:** admin

---

## Virtual Assistant Management

### GET /vas
List all VAs.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `department`

### POST /vas
Create new VA.

**Auth Required:** Yes
**Roles:** admin

**Request Body:**
```json
{
  "email": "va@example.com",
  "password": "Password123!",
  "name": "Maria Garcia",
  "department": "Admin|Marketing|Accounting|Customer Support|Operations|Other",
  "hourlyRate": 60,
  "specialization": "Administrative Support"
}
```

### GET /vas/:id
Get specific VA.

**Auth Required:** Yes
**Roles:** Any

### PUT /vas/:id
Update VA.

**Auth Required:** Yes
**Roles:** admin, va (own profile)

### DELETE /vas/:id
Delete VA.

**Auth Required:** Yes
**Roles:** admin

### GET /vas/:id/performance
Get VA performance metrics.

**Auth Required:** Yes
**Roles:** Any

**Response (200):**
```json
{
  "va": {...},
  "performance": {
    "totalHours": 120.5,
    "totalTasks": 240,
    "totalClients": 3,
    "averageRating": 4.8,
    "totalFeedback": 5
  }
}
```

---

## Time Log Management

### GET /time-logs
List all time logs.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `vaId`, `clientId`, `startDate`, `endDate`

### POST /time-logs
Create time log entry.

**Auth Required:** Yes
**Roles:** admin, va

**Request Body:**
```json
{
  "vaId": "...",
  "clientId": "...",
  "date": "2025-01-15T00:00:00.000Z",
  "hoursWorked": 5,
  "tasksCompleted": 10,
  "taskCategory": "Email Management",
  "notes": "Organized inbox, responded to inquiries"
}
```

### GET /time-logs/:id
Get specific time log.

**Auth Required:** Yes
**Roles:** Any

### PUT /time-logs/:id
Update time log.

**Auth Required:** Yes
**Roles:** admin, va

### DELETE /time-logs/:id
Delete time log.

**Auth Required:** Yes
**Roles:** admin

### GET /time-logs/summary
Get time log summary statistics.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `vaId`, `clientId`, `startDate`, `endDate`

**Response (200):**
```json
{
  "totalHours": 120,
  "totalTasks": 240,
  "totalLogs": 24,
  "averageHoursPerLog": 5
}
```

---

## Invoice Management

### GET /invoices
List all invoices.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `clientId`, `status`, `startDate`, `endDate`

### POST /invoices
Create invoice.

**Auth Required:** Yes
**Roles:** admin

**Request Body:**
```json
{
  "clientId": "...",
  "dueDate": "2025-02-15T00:00:00.000Z",
  "lineItems": [
    {
      "description": "Administrative Support - January 2025",
      "quantity": 20,
      "rate": 60,
      "amount": 1200
    }
  ]
}
```

### GET /invoices/:id
Get specific invoice.

**Auth Required:** Yes
**Roles:** Any

### PUT /invoices/:id
Update invoice.

**Auth Required:** Yes
**Roles:** admin

### DELETE /invoices/:id
Delete invoice.

**Auth Required:** Yes
**Roles:** admin

### POST /invoices/:id/pay
Mark invoice as paid.

**Auth Required:** Yes
**Roles:** admin, client

**Response (200):**
```json
{
  "message": "Invoice marked as paid",
  "invoice": {..., "status": "paid", "paidAt": "..."}
}
```

### GET /invoices/stats
Get invoice statistics.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `clientId` (optional)

**Response (200):**
```json
{
  "total": 10,
  "paid": 7,
  "unpaid": 2,
  "overdue": 1,
  "totalAmount": 12000,
  "paidAmount": 8400,
  "unpaidAmount": 3600
}
```

---

## Report Generation

### GET /reports
List all reports.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `clientId`, `type`, `status`

### POST /reports
Generate new report.

**Auth Required:** Yes
**Roles:** admin

**Request Body:**
```json
{
  "clientId": "...",
  "type": "weekly|monthly|custom",
  "periodStart": "2025-01-01T00:00:00.000Z",
  "periodEnd": "2025-01-31T23:59:59.999Z"
}
```

**Response (201):**
```json
{
  "message": "Report generated successfully",
  "report": {
    "_id": "...",
    "clientId": "...",
    "type": "monthly",
    "status": "generated",
    "metrics": {
      "roi": {...},
      "timeLogs": {...}
    }
  }
}
```

### GET /reports/:id
Get specific report.

**Auth Required:** Yes
**Roles:** Any

### DELETE /reports/:id
Delete report.

**Auth Required:** Yes
**Roles:** admin

### GET /reports/:id/download
Download report (PDF).

**Auth Required:** Yes
**Roles:** Any

---

## Document Management

### GET /documents
List all documents.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `clientId`, `fileType`

### POST /documents
Upload document.

**Auth Required:** Yes
**Roles:** Any

**Content-Type:** multipart/form-data

**Form Data:**
- `file` (file, required)
- `clientId` (string, optional)

**Response (201):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "_id": "...",
    "fileName": "...",
    "fileType": "...",
    "fileSize": 12345,
    "s3Key": "...",
    "downloadUrl": "https://..."
  }
}
```

### GET /documents/:id
Get document with presigned download URL.

**Auth Required:** Yes
**Roles:** Any

### DELETE /documents/:id
Delete document.

**Auth Required:** Yes
**Roles:** admin

### GET /documents/:id/download
Get presigned download URL.

**Auth Required:** Yes
**Roles:** Any

**Response (200):**
```json
{
  "downloadUrl": "https://...",
  "fileName": "document.pdf",
  "expiresIn": 300
}
```

---

## Feedback System

### GET /feedback
List all feedback.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `vaId`, `clientId`, `rating`

### POST /feedback
Create feedback.

**Auth Required:** Yes
**Roles:** admin, client

**Request Body:**
```json
{
  "vaId": "...",
  "rating": 5,
  "comment": "Excellent work! Very professional."
}
```

### GET /feedback/:id
Get specific feedback.

**Auth Required:** Yes
**Roles:** Any

### PUT /feedback/:id
Update feedback.

**Auth Required:** Yes
**Roles:** admin, client

### DELETE /feedback/:id
Delete feedback.

**Auth Required:** Yes
**Roles:** admin

### GET /feedback/va/:vaId/stats
Get VA feedback statistics.

**Auth Required:** Yes
**Roles:** Any

**Response (200):**
```json
{
  "total": 10,
  "averageRating": 4.8,
  "ratingDistribution": {
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 3,
    "5": 6
  }
}
```

---

## Notification System

### GET /notifications
List my notifications.

**Auth Required:** Yes
**Roles:** Any

**Query Params:**
- `page`, `limit`, `readStatus` (boolean)

**Response (200):**
```json
{
  "data": [...notifications],
  "pagination": {...},
  "unreadCount": 5
}
```

### GET /notifications/:id
Get specific notification (marks as read).

**Auth Required:** Yes
**Roles:** Any

### POST /notifications
Create notification (admin only).

**Auth Required:** Yes
**Roles:** admin

**Request Body:**
```json
{
  "userId": "...",
  "type": "invoice|report|general",
  "title": "Invoice Ready",
  "message": "Your invoice is ready to view",
  "link": "/invoices/123"
}
```

### PATCH /notifications/:id/read
Mark notification as read.

**Auth Required:** Yes
**Roles:** Any

### PATCH /notifications/read-all
Mark all notifications as read.

**Auth Required:** Yes
**Roles:** Any

### DELETE /notifications/:id
Delete notification.

**Auth Required:** Yes
**Roles:** Any

### DELETE /notifications/read-all
Delete all read notifications.

**Auth Required:** Yes
**Roles:** Any

---

## Analytics Dashboard

### GET /analytics/dashboard
Get admin dashboard analytics.

**Auth Required:** Yes
**Roles:** admin

**Response (200):**
```json
{
  "totalClients": 25,
  "totalVAs": 15,
  "totalRevenue": 125000,
  "activeProjects": 18,
  "avgClientSatisfaction": 4.7,
  "totalHoursWorked": 2400
}
```

### GET /analytics/revenue-by-month
Get revenue by month.

**Auth Required:** Yes
**Roles:** admin

**Query Params:**
- `months` (number, default: 12)

**Response (200):**
```json
[
  { "month": "2025-01", "revenue": 12000 },
  { "month": "2024-12", "revenue": 11500 }
]
```

### GET /analytics/top-vas
Get top performing VAs.

**Auth Required:** Yes
**Roles:** admin

**Query Params:**
- `limit` (number, default: 10)

**Response (200):**
```json
[
  {
    "id": "...",
    "name": "Maria Garcia",
    "department": "Admin",
    "totalHours": 240,
    "avgRating": 4.9,
    "feedbackCount": 12
  }
]
```

### GET /analytics/client/:clientId
Get client analytics.

**Auth Required:** Yes
**Roles:** Any

**Response (200):**
```json
{
  "client": {...},
  "stats": {
    "totalHours": 120,
    "totalTasks": 240,
    "totalVAs": 2,
    "totalInvoiced": 7200,
    "totalPaid": 5400,
    "outstandingBalance": 1800
  }
}
```

### GET /analytics/va/:vaId
Get VA analytics.

**Auth Required:** Yes
**Roles:** Any

**Response (200):**
```json
{
  "va": {...},
  "stats": {
    "totalHours": 240,
    "totalTasks": 480,
    "totalClients": 5,
    "totalEarnings": 14400,
    "avgRating": 4.8,
    "feedbackCount": 15
  }
}
```

---

## Error Responses

### Common Error Formats

**400 - Bad Request:**
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**401 - Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 - Forbidden:**
```json
{
  "error": "Access forbidden",
  "message": "You do not have permission to perform this action"
}
```

**404 - Not Found:**
```json
{
  "error": "Not Found",
  "message": "Cannot GET /api/v1/invalid"
}
```

**500 - Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

No rate limiting in development mode. In production, implement rate limiting as needed.

---

## Pagination

All list endpoints support pagination with these query parameters:
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)

Response format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Testing

Use the provided scripts for testing:
- `npm run check` - Verify setup
- `npm run seed` - Seed database
- `npm run verify` - Test all endpoints
- `npm run integration` - Run integration tests
- `npm run test:all` - Run all tests
