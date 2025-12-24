# The Human Capital - Admin Dashboard

A luxury, premium web admin dashboard for The Human Capital - a virtual assistant management platform. This is a UI-only implementation with mock data.

## Brand Identity

- **Company**: The Human Capital
- **Tagline**: "Where execution meets excellence"
- **Primary Color**: #0F2052 (Deep Navy)
- **Accent Color**: #d4af37 (Gold)
- **Background**: #f8f6f3 (Cream)
- **Typography**: Playfair Display (headings), Inter (body)

## Tech Stack

- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS v3
- React Router v6
- Lucide React (icons)
- Recharts (charts/graphs)

## Features

### 10 Complete Pages

1. **Dashboard** (`/`) - Overview with stats, recent users, activity, and document management
2. **Users** (`/users`) - User management with tabs for all users, clients, VAs, and admins
3. **Clients** (`/clients`) - Client management with ROI tracking
4. **Virtual Assistants** (`/virtual-assistants`) - VA team management and performance
5. **Reports** (`/reports`) - Generate and manage weekly/monthly/custom reports
6. **Invoices** (`/invoices`) - Invoice management with payment tracking
7. **Documents** (`/documents`) - File upload and document management
8. **Analytics** (`/analytics`) - ROI metrics with interactive charts
9. **Settings** (`/settings`) - System configuration and preferences
10. **Notifications** (`/notifications`) - System notifications

### UI Components

- Responsive layout with fixed sidebar navigation
- Stat cards with trends
- Data tables with sorting and actions
- Badge system for status indicators
- Modal dialogs
- File upload areas
- Interactive charts (line, bar)
- Form inputs and toggles
- Loading states and empty states

### Mock Data

All pages use realistic mock data for:
- Users, Clients, Virtual Assistants
- Invoices, Reports, Documents
- Notifications, Analytics, ROI data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components (Sidebar, Header, Layout)
│   └── charts/          # Chart components
├── pages/               # Page components for each route
├── data/                # Mock data
├── types/               # TypeScript interfaces
├── styles/              # Global CSS styles
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Design System

### Colors

- Primary: `#0F2052` (Navy)
- Accent: `#d4af37` (Gold)
- Background: `#f8f6f3` (Cream)
- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`

### Typography

- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Font sizes: xs (11px) to 6xl (36px)

### Components

All components follow luxury design principles with:
- Smooth animations and transitions
- Hover effects
- Professional color palette
- Clean, spacious layouts
- No emojis (icons only)

## Interactions

All forms and actions log to the console. This is a UI-only implementation with no backend.

- Forms: `console.log()` on submit
- Filters/Search: Client-side filtering
- Tables: Sortable, paginated (client-side)
- File Upload: Shows files in UI only
- Charts: Interactive with Recharts

## Notes

- **No Backend**: All data is mock data stored in `src/data/mockData.ts`
- **No Authentication**: Direct access to dashboard
- **No API Calls**: Everything is client-side
- **No Real File Uploads**: Files are mocked in the UI
- **Fully TypeScript**: No `any` types used

## License

Proprietary - The Human Capital
