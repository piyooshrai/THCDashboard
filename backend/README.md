# The Human Capital - Backend API

Complete, fully functional Node.js/Express backend API for The Human Capital platform.

## Features

- ✅ **Complete Authentication System** - Register, login, JWT tokens, refresh tokens
- ✅ **User Management** - Full CRUD for users with role-based access
- ✅ **Client Management** - Client profiles with hourly value calculation
- ✅ **VA Management** - Virtual assistant profiles and performance tracking
- ✅ **Time Logging** - Track hours worked with comprehensive analytics
- ✅ **Invoice Management** - Generate, track, and manage invoices
- ✅ **Report Generation** - Weekly, monthly, and custom reports
- ✅ **Document Management** - Upload to S3 with presigned URLs
- ✅ **Feedback System** - Client feedback and VA ratings
- ✅ **Notifications** - Real-time notifications for users
- ✅ **Analytics Dashboard** - Comprehensive business analytics
- ✅ **ROI Calculation** - Advanced ROI metrics for clients

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB with Mongoose 8.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Bcrypt
- **File Upload**: Multer
- **Cloud Storage**: AWS S3
- **Real-time**: Firebase Admin SDK
- **Validation**: Express Validator
- **Security**: Helmet, CORS
- **Logging**: Winston, Morgan

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database, AWS, Firebase configuration
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions, validators, logger
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Express app setup
├── scripts/
│   ├── seed.ts          # Database seeding
│   └── verify.ts        # API endpoint verification
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## Installation

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 (Optional - for document uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Firebase (Optional - for real-time features)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# VA Hourly Rate
DEFAULT_VA_HOURLY_RATE=60
```

### 3. Seed Database

```bash
npm run seed
```

This creates:
- Admin user: `admin@thehc.com / Admin123!`
- 2 Client users
- 2 VA users
- Sample time logs, invoices, and feedback

### 4. Start Development Server

```bash
npm run dev
```

Server starts on `http://localhost:5000`

## API Documentation

Base URL: `http://localhost:5000/api/v1`

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "role": "client|va|admin",
  "name": "John Doe",
  "industry": "Real Estate",
  "jobTitle": "Real Estate Agent",
  "locationState": "California"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer {token}
```

### Clients

#### Get All Clients
```http
GET /clients?page=1&limit=10
Authorization: Bearer {token}
```

#### Get Client by ID
```http
GET /clients/:id
Authorization: Bearer {token}
```

#### Get Client ROI
```http
GET /clients/:id/roi?timeframe=monthly
Authorization: Bearer {token}
```

#### Create Client
```http
POST /clients
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "Password123!",
  "name": "Jane Smith",
  "industry": "Technology",
  "jobTitle": "CEO",
  "locationState": "New York",
  "companyRevenueRange": "$1M-$5M"
}
```

### Virtual Assistants

#### Get All VAs
```http
GET /vas?page=1&limit=10
Authorization: Bearer {token}
```

#### Get VA Performance
```http
GET /vas/:id/performance
Authorization: Bearer {token}
```

#### Create VA
```http
POST /vas
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "email": "va@example.com",
  "password": "Password123!",
  "name": "Maria Garcia",
  "department": "Admin",
  "hourlyRate": 60
}
```

### Time Logs

#### Get All Time Logs
```http
GET /time-logs?vaId={id}&clientId={id}&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}
```

#### Create Time Log
```http
POST /time-logs
Authorization: Bearer {token}
Content-Type: application/json

{
  "vaId": "60d5ec49f1b2c8b1f8c4e1a1",
  "clientId": "60d5ec49f1b2c8b1f8c4e1a2",
  "date": "2025-01-15",
  "hoursWorked": 5,
  "tasksCompleted": 10,
  "taskCategory": "Email Management",
  "notes": "Organized inbox and responded to inquiries"
}
```

#### Get Time Log Summary
```http
GET /time-logs/summary?clientId={id}&startDate=2025-01-01
Authorization: Bearer {token}
```

### Invoices

#### Get All Invoices
```http
GET /invoices?clientId={id}&status=unpaid
Authorization: Bearer {token}
```

#### Create Invoice
```http
POST /invoices
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "clientId": "60d5ec49f1b2c8b1f8c4e1a2",
  "dueDate": "2025-02-15",
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

#### Mark Invoice as Paid
```http
POST /invoices/:id/pay
Authorization: Bearer {token}
```

#### Get Invoice Statistics
```http
GET /invoices/stats?clientId={id}
Authorization: Bearer {token}
```

### Reports

#### Generate Report
```http
POST /reports
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "clientId": "60d5ec49f1b2c8b1f8c4e1a2",
  "type": "monthly",
  "periodStart": "2025-01-01",
  "periodEnd": "2025-01-31"
}
```

#### Download Report
```http
GET /reports/:id/download
Authorization: Bearer {token}
```

### Documents

#### Upload Document
```http
POST /documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [file]
clientId: "60d5ec49f1b2c8b1f8c4e1a2"
```

#### Download Document
```http
GET /documents/:id/download
Authorization: Bearer {token}
```

### Feedback

#### Create Feedback
```http
POST /feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "vaId": "60d5ec49f1b2c8b1f8c4e1a3",
  "rating": 5,
  "comment": "Excellent work!"
}
```

#### Get VA Feedback Stats
```http
GET /feedback/va/:vaId/stats
Authorization: Bearer {token}
```

### Notifications

#### Get My Notifications
```http
GET /notifications?readStatus=false
Authorization: Bearer {token}
```

#### Mark as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer {token}
```

#### Mark All as Read
```http
PATCH /notifications/read-all
Authorization: Bearer {token}
```

### Analytics

#### Dashboard Analytics
```http
GET /analytics/dashboard
Authorization: Bearer {admin-token}
```

#### Revenue by Month
```http
GET /analytics/revenue-by-month?months=12
Authorization: Bearer {admin-token}
```

#### Top Performing VAs
```http
GET /analytics/top-vas?limit=10
Authorization: Bearer {admin-token}
```

#### Client Analytics
```http
GET /analytics/client/:clientId
Authorization: Bearer {token}
```

#### VA Analytics
```http
GET /analytics/va/:vaId
Authorization: Bearer {token}
```

## Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
```

### Production
```bash
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
```

### Database
```bash
npm run seed         # Seed database with sample data
```

### Verification
```bash
npm run verify       # Test all API endpoints
```

## Authentication & Authorization

### Roles
- **admin**: Full access to all endpoints
- **client**: Access to own data, create feedback, view reports
- **va**: Access to own data, create/update time logs

### Protected Routes
All routes except `/auth/register` and `/auth/login` require authentication via JWT Bearer token.

### Token Usage
Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

All errors return JSON in this format:
```json
{
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## ROI Calculation

The platform calculates ROI based on:
- **Client Hourly Value**: Calculated from job title, location, company revenue
- **Hours Reclaimed**: Based on baseline admin hours per week
- **VA Cost**: VA hours worked × hourly rate
- **Net Savings**: Value of reclaimed time - VA cost
- **ROI Percentage**: (Net Savings / VA Cost) × 100

## Security Features

- Password hashing with bcrypt
- JWT authentication with refresh tokens
- Role-based access control
- Input validation on all endpoints
- SQL injection prevention (NoSQL)
- XSS protection via Helmet
- CORS configuration
- Rate limiting (recommended for production)

## Testing

The verification script tests all endpoints:
```bash
npm run verify
```

This tests:
- ✅ Health check
- ✅ Authentication (register, login, profile)
- ✅ User management
- ✅ Client CRUD and ROI
- ✅ VA CRUD and performance
- ✅ Time logs and summaries
- ✅ Invoice creation and payment
- ✅ Report generation
- ✅ Feedback system
- ✅ Notifications
- ✅ Analytics dashboard

## Production Deployment

### Environment Variables
Ensure all production environment variables are set securely.

### Build
```bash
npm run build
```

### Start
```bash
NODE_ENV=production npm start
```

### Recommended Setup
- Use a process manager like PM2
- Set up MongoDB Atlas for database
- Configure AWS S3 for file storage
- Use environment-specific configs
- Enable logging and monitoring
- Set up automated backups

## Troubleshooting

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### Authentication Errors
- Verify JWT_SECRET is set
- Check token expiration time
- Ensure Bearer token format is correct

### File Upload Issues
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure file size is under 10MB

## Support

For issues or questions, please contact the development team or open an issue in the repository.

## License

Proprietary - The Human Capital Platform
