# PayAssured - Invoice Recovery Case Tracker

A full-stack internal CRM application built for PayAssured to manage clients and track invoice recovery cases. This tool helps teams efficiently monitor unpaid invoices, track follow-ups, and manage recovery progress.

## 🎯 Project Overview

This application allows PayAssured's internal teams to:

- **Manage Clients**: Store and organize client information including company details, contact persons, and contact information
- **Track Recovery Cases**: Monitor invoice recovery progress with detailed case information
- **Filter & Sort**: Quickly find cases by status and sort by due dates
- **Update Progress**: Record follow-up notes and update case statuses in real-time

## 🛠️ Tech Stack

### Frontend

- **React** - Modern UI library for building interactive interfaces
- **Vite** - Lightning-fast build tool and dev server
- **React Router DOM** - Client-side routing for seamless navigation
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful, consistent icon library for professional UI

### Backend

- **Flask** - Lightweight Python web framework
- **psycopg2-binary** - PostgreSQL database adapter for raw SQL queries
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **python-dotenv** - Environment variable management

### Database

- **PostgreSQL** (Supabase) - Robust relational database with proper foreign key constraints

## 📁 Project Structure

```
assignment-implementation/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # All page components
│   │   │   ├── Home.jsx
│   │   │   ├── ClientList.jsx
│   │   │   ├── AddClient.jsx
│   │   │   ├── CaseList.jsx
│   │   │   ├── AddCase.jsx
│   │   │   └── CaseDetail.jsx
│   │   ├── App.jsx           # Main app with navigation
│   │   ├── config.js         # API configuration
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Flask backend
│   ├── routes/               # Organized route modules
│   │   ├── client_routes.py  # Client management endpoints
│   │   └── case_routes.py    # Case management endpoints
│   ├── app.py                # Main Flask application
│   ├── .env                  # Environment variables (not in git)
│   ├── .env.example          # Example environment file
│   └── requirements.txt      # Python dependencies
│
├── db/                        # Database schema files
│   ├── schema.sql            # SQL schema to create tables
│   └── README.md             # Schema documentation
│
├── screenshots/               # Application screenshots
│
└── README.md                 # This file
```

## 🗄️ Database Schema

For the complete database schema and table structure:

- **Schema SQL File**: [`db/schema.sql`](../db/schema.sql) - Copy and paste this to create tables
- **Schema Documentation**: [`db/README.md`](../db/README.md) - Detailed schema format and descriptions

The database includes two main tables: `clients` and `cases` with a one-to-many relationship.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** database (or Supabase account)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/binduu04/payassured-assignment
```

### 2. Database Setup (Using Supabase)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and copy-paste the content from [`db/schema.sql`](../db/schema.sql) file
4. Run the query to create tables

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
```

**Important**: Add the `.env` file in backend folder and add your database URL:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

**Note**: If your password contains special characters like `@`, make sure to URL-encode them:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`

Example:

```env
DATABASE_URL=postgresql://postgres.xxx:MyPass%40123@aws-0-region.pooler.supabase.com:5432/postgres
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# The frontend is configured to connect to http://localhost:5000
# You can change this in src/config.js if needed
```

### 5. Running the Application

#### Start Backend Server

```bash
# From backend directory with activated virtual environment
python app.py
```

The backend will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
npm run dev
```

The frontend will start on `http://localhost:5173`

**🎉 Open your browser and visit: `http://localhost:5173`**

## 📡 API Endpoints

### Client APIs

- `POST /api/clients` - Create a new client
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get specific client

### Case APIs

- `POST /api/cases` - Create a new recovery case
- `GET /api/cases` - Get all cases (supports filtering and sorting)
  - Query params: `?status=<status>&sort=<asc|desc>`
- `GET /api/cases/:id` - Get specific case details
- `PATCH /api/cases/:id` - Update case status and notes

### Health Check

- `GET /api/health` - Check if API is running

## ✨ Features Implemented

### Client Management

- Add new clients with complete information
- View all clients in a clean, professional table
- Icons for better visual hierarchy
- Form validation with helpful error messages

### Case Management

- Create cases linked to existing clients
- View all cases with client information
- Filter cases by status (New, In Follow-up, Partially Paid, Closed)
- Sort cases by due date (ascending/descending)
- Detailed case view with all information
- Update case status and follow-up notes
- Color-coded status badges for quick identification

### UI/UX

- Professional, minimalistic design using lucide-react icons
- Responsive layout that works on all screen sizes
- Sticky navigation bar for easy access
- Loading states and error handling
- Smooth transitions and hover effects
- Clean form designs with icon-enhanced inputs

### Backend Architecture

- Organized routes using Flask Blueprints
- Separated client and case routes into different modules
- Raw SQL queries using psycopg2 for database operations
- Input validation on all endpoints
- Proper error handling with appropriate HTTP status codes
- CORS enabled for frontend communication

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=your_postgresql_connection_string
```

## 👤 Author

Created as part of PayAssured Full Stack Internship Assignment

---
