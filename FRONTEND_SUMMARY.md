# Frontend - School Result Management System

## Overview
A complete React + Vite + Tailwind CSS frontend application for the School Result Management System. The application provides three distinct user portals (Admin, Staff, Student) with full functionality for managing students, staff, classes, subjects, sessions, and academic results.

## Technology Stack
- **Vite**: Ultra-fast frontend build tool with Hot Module Replacement (HMR)
- **React 19**: Modern UI library with hooks
- **React Router v6**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework with @tailwindcss/vite plugin
- **Axios**: Promise-based HTTP client for API requests
- **React Hot Toast**: Toast notifications for user feedback
- **Lucide React**: Beautiful, consistent SVG icons

## Project Structure
```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── AdminLayout.jsx      # Admin portal layout with sidebar
│   │   ├── StaffLayout.jsx      # Staff portal layout with sidebar
│   │   ├── StudentLayout.jsx    # Student portal layout with sidebar
│   │   ├── Sidebar.jsx          # Shared sidebar component
│   │   └── Modal.jsx            # Reusable modal dialog
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication context and provider
│   ├── services/
│   │   └── api.js               # Axios instance with baseURL configuration
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── admin/               # Admin portal pages
│   │   │   ├── Dashboard.jsx        # Admin dashboard with statistics
│   │   │   ├── Students.jsx         # Student management (CRUD)
│   │   │   ├── StaffPage.jsx        # Staff management (CRUD)
│   │   │   ├── Classes.jsx          # Class management
│   │   │   ├── Subjects.jsx         # Subject management
│   │   │   ├── Sessions.jsx         # Sessions and Terms management
│   │   │   ├── Assignments.jsx      # Staff to class assignments
│   │   │   ├── ResultsApproval.jsx  # Approve/reject results
│   │   │   └── AllResults.jsx       # View all results with filters
│   │   ├── staff/               # Staff portal pages
│   │   │   ├── Dashboard.jsx        # Staff dashboard with overview
│   │   │   ├── Assignments.jsx      # View assignments
│   │   │   ├── EnterResults.jsx     # Enter and submit results
│   │   │   └── MyResults.jsx        # View submitted results
│   │   └── student/             # Student portal pages
│   │       ├── Dashboard.jsx        # Student dashboard
│   │       ├── Results.jsx          # View academic results
│   │       └── Profile.jsx          # View personal profile
│   ├── App.jsx                  # Main App component with routing
│   ├── main.jsx                 # React root and app initialization
│   └── index.css                # Tailwind CSS imports
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
├── index.html                   # HTML entry point
└── dist/                        # Production build output

```

## Key Features

### Authentication
- Token-based authentication using localStorage
- AuthContext for managing user state and login/logout
- Automatic token persistence and API header injection
- Protected routes that redirect unauthorized users to login

### Admin Portal
- **Dashboard**: Overview statistics (students, staff, classes, pending approvals)
- **Student Management**: CRUD operations with class assignment
- **Staff Management**: CRUD operations with department assignment
- **Class Management**: Create and manage classes with levels
- **Subject Management**: Create and manage subjects with codes
- **Sessions & Terms**: Create sessions and terms, set current session/term
- **Assignments**: Assign staff to classes for specific subjects and sessions
- **Results Approval**: Review and approve/reject submitted results
- **All Results**: View all results with filtering by class, subject, session, status

### Staff Portal
- **Dashboard**: Quick overview of assignments and results count
- **Assignments**: View all assigned subjects and classes
- **Enter Results**: 
  - Select assignment and term
  - Enter CA1, CA2, CA3, and Exam scores
  - Automatic total calculation and grade assignment
  - Save as draft or submit for approval
- **My Results**: Track submitted results with status indicators

### Student Portal
- **Dashboard**: Personal information overview
- **Results**: 
  - View results organized by session and term
  - Detailed breakdown with CA1, CA2, CA3, Exam, Total, Grade, Remark
  - Average calculation per term
- **Profile**: Complete personal and guardian information

## Build & Deployment

### Development
```bash
cd frontend
npm install
npm run dev  # Start Vite dev server with HMR
```

### Production Build
```bash
cd frontend
npm run build  # Creates optimized dist/ folder
```

### Build Output
- **HTML**: 0.46 KB (gzip: 0.29 KB)
- **CSS**: 19.67 KB (gzip: 4.46 KB)
- **JavaScript**: 349.24 KB (gzip: 104.07 KB)
- **Total modules**: 1815 transformed

## API Integration

The frontend connects to the backend API through:
- **Proxy**: `/api` routes are proxied to `http://localhost:5000` in development
- **axios instance**: `src/services/api.js` provides configured Axios instance
- **Authentication**: Bearer token passed in `Authorization` header
- **Error handling**: Toast notifications for errors, proper HTTP status handling

### API Endpoints Used
```
Authentication:
- POST /api/auth/login
- GET /api/auth/me

Admin:
- GET/POST /api/admin/students
- PUT/DELETE /api/admin/students/{id}
- GET/POST /api/admin/staff
- PUT/DELETE /api/admin/staff/{id}
- GET/POST /api/admin/classes
- PUT/DELETE /api/admin/classes/{id}
- GET/POST /api/admin/subjects
- PUT/DELETE /api/admin/subjects/{id}
- GET/POST /api/admin/sessions
- PUT /api/admin/sessions/{id}/set-current
- POST /api/admin/sessions/{id}/terms
- PUT /api/admin/sessions/{id}/terms/{id}/set-current
- GET/POST /api/admin/assignments
- DELETE /api/admin/assignments/{id}
- GET /api/admin/stats
- GET /api/admin/results/pending
- PUT /api/admin/results/{id}/approve
- PUT /api/admin/results/{id}/reject
- GET /api/admin/results

Staff:
- GET /api/staff/assignments
- GET /api/staff/students
- POST /api/staff/results
- GET /api/staff/results

Student:
- GET /api/student/profile
- GET /api/student/results
```

## Code Quality

### Code Review
- ✅ Token initialization properly handled in AuthContext
- ✅ Type-safe comparisons for assignment IDs
- ✅ Proper error handling and user feedback
- ✅ Loading states for async operations

### Security
- ✅ No vulnerabilities detected (CodeQL)
- ✅ Token stored in localStorage with proper security practices
- ✅ API authentication via Bearer tokens
- ✅ Protected routes for authorized users only

## Component Architecture

### Layout Components
- **AdminLayout**: Two-column layout with sidebar and main content
- **StaffLayout**: Two-column layout with sidebar and main content
- **StudentLayout**: Two-column layout with sidebar and main content
- **Sidebar**: Responsive navigation with active route highlighting
- **Modal**: Reusable dialog for forms

### Page Components
- Use React hooks (useState, useEffect, useContext)
- Proper loading and error states
- Form validation and error handling
- Toast notifications for feedback
- Responsive design for mobile and desktop

### Service Layer
- **api.js**: Centralized Axios configuration
- **AuthContext.jsx**: Authentication state management

## UI/UX Features

### Design System
- **Color Scheme**: Indigo primary with complementary grays
- **Typography**: Clear hierarchy with font sizes and weights
- **Spacing**: Consistent padding and margins using Tailwind utilities
- **Interactive Elements**: Hover states, focus rings, transitions

### User Experience
- Loading spinners during async operations
- Toast notifications for success/error messages
- Form validation with required field indicators
- Modal dialogs for CRUD operations
- Responsive tables for data display
- Responsive grid layouts for statistics

## Testing & Validation

### Frontend Validation
- All required fields validated in forms
- Type coercion handled safely with parseInt()
- API error responses displayed to users
- Loading states prevent duplicate submissions

### Known Limitations
- Pagination not implemented (assumes small datasets)
- Search limited to client-side filtering
- No image uploads supported
- No offline functionality

## Future Enhancements

1. **Performance**
   - Add React.lazy for code splitting
   - Implement pagination for large datasets
   - Add caching for API responses

2. **Features**
   - Export results to PDF
   - Email notifications
   - Advanced search and filtering
   - Data visualization (charts/graphs)

3. **Security**
   - Implement token refresh logic
   - Add password change functionality
   - Two-factor authentication support

4. **Testing**
   - Add unit tests with Jest
   - Add integration tests with React Testing Library
   - Add E2E tests with Cypress

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

## Dependencies

### Production
- react@^18.3.1
- react-dom@^18.3.1
- react-router-dom@^6.28.1
- axios@^1.7.9
- react-hot-toast@^2.4.1
- lucide-react@^0.469.1

### Development
- @vitejs/plugin-react@^4.3.4
- @tailwindcss/vite@^3.3.6
- tailwindcss@^3.4.17
- vite@^7.3.1
- eslint@^9.17.0

## Commits

1. **feat: add React + Vite + Tailwind CSS frontend**
   - Initial scaffold with Vite and all dependencies
   - Complete component structure
   - All 26 pages and components
   - Routing configuration
   - Build successful with 349 KB JavaScript (gzip)

2. **fix: improve api.js and EnterResults.jsx**
   - Remove redundant token initialization from api.js
   - Fix type coercion with parseInt() for ID comparisons
   - Ensure proper token handling in AuthContext

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd School-Reuslt-Management

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# The app will be available at http://localhost:5173
```

The frontend is now ready to integrate with the Flask backend API!
