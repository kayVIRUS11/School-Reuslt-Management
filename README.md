# School Result Management System

A full-stack web application for managing academic results across three roles: **Admin**, **Staff/Teacher**, and **Student**.

![Login Page](https://github.com/user-attachments/assets/eb577ad5-a14a-41cd-af32-820662af4d33)
![Admin Dashboard](https://github.com/user-attachments/assets/aa5e0bde-9042-4ceb-ba4f-5ed5000c7386)

## Features

- **Role-based access control** (Admin / Staff / Student)
- **Username/ID-based authentication** — No email required
- **JWT-secured API** with bcrypt password hashing
- **Result workflow**: Draft → Submitted → Approved / Rejected
- **Auto-calculated** total, grade, and remark from grading scale
- **Live grade preview** as staff enter scores
- **Responsive UI** with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python + Flask (REST API) |
| Frontend | React (Vite) + Tailwind CSS |
| Database | SQLite via SQLAlchemy ORM |
| Auth | JWT + bcrypt |

---

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| Staff | *(create via Admin panel)* | *(set by Admin)* |
| Student | *(create via Admin panel)* | *(set by Admin)* |

---

## Project Structure

```
/backend
  /app
    __init__.py        Flask app factory
    config.py          Configuration
    models.py          SQLAlchemy models
    /routes
      auth.py          Auth endpoints
      admin.py         Admin endpoints
      staff.py         Staff endpoints
      student.py       Student endpoints
    /utils
      auth.py          JWT helpers, decorators
      grading.py       Grade calculation logic
  requirements.txt
  seed.py              Seed default data
  run.py               Entry point

/frontend
  /src
    /components        Sidebar, Layout, Modal, StatCard
    /pages
      /admin           Dashboard, Students, Staff, Classes, Subjects, Sessions, Assignments, Results
      /staff           Dashboard, MyAssignments, EnterResults, MyResults
      /student         Dashboard, MyResults, Profile
      Login.jsx
    /context           AuthContext (JWT management)
    /services          api.js (Axios service layer)
    App.jsx
    main.jsx
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/kayVIRUS11/School-Reuslt-Management.git
cd School-Reuslt-Management
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with default data
python seed.py

# Start the Flask server (runs on port 5000)
python run.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite dev server (runs on port 5173)
npm run dev
```

### 4. Open the app

Visit **http://localhost:5173** and log in with:
- Username: `admin`
- Password: `admin123`

> The Vite dev server proxies all `/api` requests to the Flask backend at `http://localhost:5000`.

---

## Score Breakdown

| Component | Max Marks |
|-----------|-----------|
| 1st CA | 10 |
| 2nd CA | 10 |
| 3rd CA | 10 |
| Exam | 70 |
| **Total** | **100** |

### Grading Scale

| Score Range | Grade | Remark |
|-------------|-------|--------|
| 70 – 100 | A | Excellent |
| 60 – 69 | B | Very Good |
| 50 – 59 | C | Good |
| 45 – 49 | D | Fair |
| 40 – 44 | E | Pass |
| 0 – 39 | F | Fail |

---

## Role Descriptions

### Admin
- Manages students, staff, classes, subjects, academic sessions and terms
- Assigns staff members to subject+class combinations
- Approves or rejects submitted results
- Views all results with filters

### Staff / Teacher
- Views their assigned subjects and classes
- Enters results (CA1, CA2, CA3, Exam) for students — live grade preview as scores are typed
- Saves results as **Draft** then **Submits** for admin approval

### Student
- Views their own **approved** results filtered by term/session
- Views their profile information

---

## Seed Data

Running `python seed.py` creates:
- **Admin account**: `admin` / `admin123`
- **Grading scale** (6 grade bands)
- **Academic session**: 2025/2026 with First, Second, Third Terms (First Term set as current)
- **Classes**: JSS1A, JSS1B, JSS2A, SS1A, SS2A, SS3A
- **Subjects**: Mathematics, English Language, Physics, Chemistry, Biology, History, Geography

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/admin/students` | List / create students |
| PUT/DELETE | `/api/admin/students/<id>` | Update / delete student |
| GET/POST | `/api/admin/staff` | List / create staff |
| PUT/DELETE | `/api/admin/staff/<id>` | Update / delete staff |
| CRUD | `/api/admin/classes` | Manage classes |
| CRUD | `/api/admin/subjects` | Manage subjects |
| CRUD | `/api/admin/sessions` | Manage academic sessions |
| CRUD | `/api/admin/terms` | Manage terms |
| POST | `/api/admin/assign-subject` | Assign staff to subject+class |
| GET | `/api/admin/assignments` | List all assignments |
| DELETE | `/api/admin/assignments/<id>` | Remove assignment |
| GET | `/api/admin/results/pending` | Pending results |
| POST | `/api/admin/results/approve/<id>` | Approve result |
| POST | `/api/admin/results/reject/<id>` | Reject result |
| GET | `/api/admin/results` | All results (filterable) |
| GET | `/api/admin/stats` | Dashboard stats |

### Staff
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/staff/my-assignments` | My assigned subjects/classes |
| GET | `/api/staff/classes/<id>/students` | Students in a class |
| POST | `/api/staff/results` | Enter/update results (bulk) |
| PUT | `/api/staff/results/<id>` | Edit a draft result |
| POST | `/api/staff/results/submit` | Submit results for approval |
| GET | `/api/staff/results` | My entered results |
| GET | `/api/staff/stats` | Staff dashboard stats |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/results` | My approved results |
| GET | `/api/student/profile` | My profile |