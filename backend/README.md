# Backend - Employee Management System

This backend service connects to two separate databases: **MongoDB** for user authentication and **PostgreSQL** (via Sequelize ORM) for employee management.

## Prerequisites

Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or on Atlas)
- [PostgreSQL](https://www.postgresql.org/download/) (Running locally)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the `backend` root directory (if it doesn't already exist) and configure your database connection strings:

```env
PORT=3000
HOST_NAME=localhost
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD="password"
DB_NAME=employee_db
MONGODB_URI=mongodb://localhost:27017/employee_auth_db
JWT_SECRET=your_secret_key
```

## Database Setup & Seeding

Before starting the server, you need to sync the PostgreSQL tables and seed initial data (Roles and a Test Admin User):

```bash
npm run seed
```

This will:
- Connect to MongoDB and create the `users` collection.
- Connect to PostgreSQL, create the `Employees` and `RoleMasters` tables.
- Seed default roles (Admin, Manager, Employee).
- Create a test user: `admin@example.com` / `password123`.

## Running the Server

To start the backend server:

```bash
npm start
```

The server will be running at `http://localhost:3000`.

## API Endpoints

### Authentication (MongoDB)
- `POST /api/v1/signup` - Register a new user
- `POST /api/v1/login` - Authenticate and get JWT token

### Employee Management (PostgreSQL)
- `GET /api/v1/roles` - Get all employee roles
- `GET /api/v1/employees` - Get all active employees
- `GET /api/v1/employees/:id` - Get employee details by ID
- `POST /api/v1/addemployees` - Create a new employee
- `POST /api/v1/editemployees/:id` - Update an employee
- `POST /api/v1/deleteemployees` - Soft delete an employee (sends `id` in body)
