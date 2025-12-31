# API Integration Guide
**The Human Capital - Frontend to Backend Integration**

Date: December 31, 2025

---

## ✅ Completed Integration Work

### 1. Infrastructure Setup

#### Axios & HTTP Client (✅ Complete)
- **File**: `src/services/api.ts`
- **Features**:
  - Axios instance with base URL configuration
  - Request interceptor for JWT token injection
  - Response interceptor for automatic token refresh
  - Auto-redirect to login on auth failure
  - 30-second timeout for all requests

#### Environment Variables (✅ Complete)
- **Files**: `.env`, `.env.example`
- **Variables**:
  - `VITE_API_URL`: Backend API base URL (default: http://localhost:5000/api/v1)
  - `VITE_APP_NAME`: Application name
  - `VITE_APP_ENV`: Environment (development/production)

### 2. Service Layer (✅ Complete)

All backend API endpoints wrapped in TypeScript services with full type safety:

#### Authentication Service
- **File**: `src/services/authService.ts`
- **Endpoints**: Register, Login, Logout, Get Profile, Refresh Token
- **Features**: Local storage management, type-safe responses

#### User Service
- **File**: `src/services/userService.ts`
- **Endpoints**: Get All, Get By ID, Update, Delete, Toggle Status
- **Features**: Pagination, filtering, role-based queries

#### Client Service
- **File**: `src/services/clientService.ts`
- **Endpoints**: CRUD + ROI calculation, Hourly value calculation
- **Features**: Industry filtering, ROI timeframe selection

#### VA Service
- **File**: `src/services/vaService.ts`
- **Endpoints**: CRUD + Performance metrics
- **Features**: Specialization filtering, performance tracking

#### Time Log Service
- **File**: `src/services/timeLogService.ts`
- **Endpoints**: CRUD + Summary statistics
- **Features**: Date range filtering, billable/approved filtering

#### Invoice Service
- **File**: `src/services/invoiceService.ts`
- **Endpoints**: CRUD + Mark as Paid, Get Stats
- **Features**: Status filtering, payment tracking

#### Analytics Service
- **File**: `src/services/analyticsService.ts`
- **Endpoints**: Dashboard stats, Revenue by month, Top VAs, Client/VA analytics
- **Features**: Comprehensive metrics and insights

#### Document Service
- **File**: `src/services/documentService.ts`
- **Endpoints**: Upload, Download, Delete, Get All
- **Features**: File upload with FormData, presigned URL downloads

#### Report Service
- **File**: `src/services/reportService.ts`
- **Endpoints**: Generate, Download, Delete
- **Features**: PDF generation, date range reports

#### Notification Service
- **File**: `src/services/notificationService.ts`
- **Endpoints**: CRUD + Mark as Read, Mark All as Read
- **Features**: Unread count, type filtering

#### Feedback Service
- **File**: `src/services/feedbackService.ts`
- **Endpoints**: CRUD + VA Statistics
- **Features**: Rating-based filtering, category breakdowns

### 3. Authentication & Authorization (✅ Complete)

#### Auth Context
- **File**: `src/contexts/AuthContext.tsx`
- **Features**:
  - Global authentication state management
  - Auto-load user on app mount
  - Login/logout methods
  - User refresh capability
  - `useAuth()` hook for easy access

#### Protected Routes
- **File**: `src/components/ProtectedRoute.tsx`
- **Features**:
  - Route-level authentication check
  - Role-based access control (allowedRoles prop)
  - Loading state during auth check
  - Auto-redirect to login if not authenticated
  - Access denied page for insufficient permissions

#### Login Page
- **File**: `src/pages/Login.tsx`
- **Features**:
  - Beautiful login UI matching design system
  - Form validation
  - Loading states
  - Error handling
  - Demo credential quick-fill buttons
  - JWT token management

### 4. UI Components (✅ Complete)

#### Loading Spinner
- **File**: `src/components/LoadingSpinner.tsx`
- **Features**: Full-screen or inline, customizable message

#### Error Message
- **File**: `src/components/ErrorMessage.tsx`
- **Features**: Full-screen or inline, retry button, custom title/message

### 5. Routing (✅ Complete)

#### Updated App.tsx
- **File**: `src/App.tsx`
- **Features**:
  - AuthProvider wrapping all routes
  - Public login route
  - Protected routes with authentication
  - Role-based route protection (Users page = admin only)
  - Catch-all redirect to dashboard
  - Layout integration for protected routes

### 6. Dashboard Integration (✅ Complete)

#### Updated Dashboard Page
- **File**: `src/pages/Dashboard.tsx`
- **Real API Integration**:
  - ✅ Dashboard statistics from analytics API
  - ✅ Recent users from user API
  - ✅ Documents from document API
  - ✅ Clients list for dropdown
  - ✅ File upload functionality
  - ✅ File download functionality
  - ✅ File delete functionality
  - ✅ Loading states
  - ✅ Error handling with retry
  - ✅ User role-based UI (admin-only features)

---

## 🔄 Remaining Integration Work

### Pages Requiring API Integration

#### 1. Users Page (`src/pages/Users.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace mockUsers with userService.getAll()
- [ ] Implement user creation with userService
- [ ] Implement user updates
- [ ] Implement user deletion
- [ ] Add loading/error states
- [ ] Add pagination
- [ ] Add filtering (role, status, search)

#### 2. Clients Page (`src/pages/Clients.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace mockClients with clientService.getAll()
- [ ] Implement client creation
- [ ] Implement client updates
- [ ] Implement ROI calculation display
- [ ] Add hourly value calculator
- [ ] Add loading/error states
- [ ] Add filtering (industry, status)

#### 3. Virtual Assistants Page (`src/pages/VirtualAssistants.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace mockVAs with vaService.getAll()
- [ ] Implement VA creation
- [ ] Implement VA updates
- [ ] Display performance metrics
- [ ] Add loading/error states
- [ ] Add filtering (specialization, status)

#### 4. Invoices Page (`src/pages/Invoices.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace mockInvoices with invoiceService.getAll()
- [ ] Implement invoice creation
- [ ] Implement mark as paid
- [ ] Display invoice stats
- [ ] Add loading/error states
- [ ] Add filtering (status, client, VA)

#### 5. Reports Page (`src/pages/Reports.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace mockReports with reportService.getAll()
- [ ] Implement report generation
- [ ] Implement report download
- [ ] Add loading/error states
- [ ] Add filtering (type, date range)

#### 6. Documents Page (`src/pages/Documents.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace mockDocuments with documentService.getAll()
- [ ] Implement document upload
- [ ] Implement document download
- [ ] Implement document delete
- [ ] Add loading/error states
- [ ] Add filtering (category, client)

#### 7. Analytics Page (`src/pages/Analytics.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Use analyticsService.getRevenueByMonth()
- [ ] Use analyticsService.getTopVAs()
- [ ] Use analyticsService.getDashboard()
- [ ] Implement real charts with live data
- [ ] Add loading/error states
- [ ] Add date range selectors

#### 8. Settings Page (`src/pages/Settings.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Implement profile updates with authService
- [ ] Implement password change
- [ ] Implement notification preferences
- [ ] Add loading/error states

#### 9. Notifications Page (`src/pages/Notifications.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Replace with notificationService.getAll()
- [ ] Implement mark as read
- [ ] Implement mark all as read
- [ ] Implement delete
- [ ] Add loading/error states
- [ ] Add real-time updates (optional)

#### 10. Client Portal Page (`src/pages/ClientPortal.tsx`)
**Current State**: Uses mock data
**Required Changes**:
- [ ] Fetch client data by ID from URL params
- [ ] Display client-specific ROI
- [ ] Display assigned VAs
- [ ] Display client time logs
- [ ] Add loading/error states

---

## 📋 Integration Pattern (Copy-Paste Template)

### For Any Page Requiring API Integration:

```typescript
import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useToast } from '../components/common/Toast'
import { yourService } from '../services/yourService'

export const YourPage: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<any[]>([])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await yourService.getAll()
      setData(response.items)
    } catch (err: any) {
      console.error('Failed to load data:', err)
      setError(err.response?.data?.error || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (newData: any) => {
    try {
      await yourService.create(newData)
      showToast({ type: 'success', message: 'Created successfully' })
      await loadData() // Refresh list
    } catch (err: any) {
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to create' })
    }
  }

  const handleUpdate = async (id: string, updateData: any) => {
    try {
      await yourService.update(id, updateData)
      showToast({ type: 'success', message: 'Updated successfully' })
      await loadData() // Refresh list
    } catch (err: any) {
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to update' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await yourService.delete(id)
      showToast({ type: 'success', message: 'Deleted successfully' })
      await loadData() // Refresh list
    } catch (err: any) {
      showToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete' })
    }
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading..." />
  }

  // Error state
  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />
  }

  // Render your page with real data
  return (
    <div>
      {/* Your page content using {data} */}
    </div>
  )
}
```

---

## 🧪 Testing Instructions

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

Backend should be running at `http://localhost:5000`

### 2. Seed Database (First Time Only)
```bash
cd backend
npm run seed
```

This creates test data:
- Admin: `admin@thehc.com` / `Admin123!`
- Client1: `client1@example.com` / `Client123!`
- Client2: `client2@example.com` / `Client123!`

### 3. Start Frontend
```bash
npm run dev
```

Frontend should be running at `http://localhost:5173`

### 4. Test Flow

1. **Login**: Go to `/login` → Use admin credentials
2. **Dashboard**: Should load real stats from backend
3. **Upload Document**: Test file upload functionality
4. **Download Document**: Test file download
5. **Delete Document**: Test file deletion
6. **Check All Pages**: Navigate through all routes

---

## 🔐 Authentication Flow

### How It Works

1. **User enters credentials** on Login page
2. **POST /api/v1/auth/login** → Backend validates
3. **Backend returns**:
   - `accessToken` (JWT, 15m expiry)
   - `refreshToken` (JWT, 7d expiry)
   - `user` object
4. **Frontend saves** to localStorage
5. **All API requests** include `Authorization: Bearer <accessToken>` header
6. **Token expires** → Interceptor catches 401
7. **POST /api/v1/auth/refresh-token** with refreshToken
8. **Get new accessToken** → Retry original request
9. **Refresh fails** → Redirect to login

---

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

---

## 🎯 Next Steps Priority

### High Priority (Core Functionality)
1. Update **Users** page - Admin functionality
2. Update **Clients** page - Core business logic
3. Update **Virtual Assistants** page - Core business logic
4. Update **Invoices** page - Financial tracking

### Medium Priority (Extended Features)
5. Update **Reports** page
6. Update **Documents** page
7. Update **Analytics** page
8. Update **Notifications** page

### Low Priority (User Settings)
9. Update **Settings** page
10. Update **Client Portal** page

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized on All Requests
**Solution**: Token might be expired or invalid. Clear localStorage and login again.

```javascript
localStorage.clear()
// Then reload page
```

### Issue: CORS Errors
**Solution**: Ensure backend CORS is configured for `http://localhost:5173`

```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
```

### Issue: Network Error / Cannot Connect
**Solution**: Ensure backend is running and URL in `.env` is correct

```bash
# Check backend is running
curl http://localhost:5000/api/v1/health

# Update .env if needed
VITE_API_URL=http://localhost:5000/api/v1
```

### Issue: TypeScript Errors
**Solution**: Ensure all service interfaces match backend response types

---

## 📚 Resources

- **Backend API Documentation**: `backend/docs/API_COMPLETE.md`
- **Backend Verification Report**: `BACKEND_VERIFICATION_REPORT.md`
- **Service Files**: `src/services/*.ts`
- **Example Integration**: `src/pages/Dashboard.tsx`

---

## ✨ Success Criteria

**Integration is complete when:**

- ✅ All pages fetch data from backend API (no mock data)
- ✅ CRUD operations work on all entities
- ✅ Authentication works end-to-end
- ✅ Token refresh works automatically
- ✅ File uploads/downloads work
- ✅ Loading states shown during API calls
- ✅ Errors handled gracefully with retries
- ✅ No console errors
- ✅ All TypeScript types are correct
- ✅ Protected routes redirect properly

---

**Integration Progress: 35% Complete**
- Infrastructure: ✅ 100%
- Services: ✅ 100%
- Auth: ✅ 100%
- Pages: 🔄 10% (1/10 pages updated)

---

Generated: December 31, 2025
Maintained by: Claude Code Agent
