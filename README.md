# Student Management System

This is a **Student Management System** built with **React.js** (frontend), **Node.js** (backend), and **PostgreSQL** (database). The system allows users to manage student records, including their personal details and marks, through a web application.

---

## Features

- **CRUD Operations**: Create, Read, Update, and Delete student records.
- **Pagination**: Retrieve student records in smaller chunks using server-side pagination.
- **Search Functionality**: Search for students by name or email.
- **User Feedback**: SweetAlerts for notifications on successful operations.
- **Responsive Design**: Built with Bootstrap for a seamless experience on all devices.

---

## Technologies Used

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **TypeScript**: Adds static typing to JavaScript for better code quality.
- **Bootstrap**: A CSS framework for responsive design.
- **SweetAlerts**: A library for beautiful and customizable alerts.

### Backend
- **Node.js**: A JavaScript runtime for building scalable backend applications.
- **Express**: A web framework for Node.js.
- **PostgreSQL**: A powerful relational database for storing student data.
- **Inversify**: A dependency injection library for managing dependencies.
- **inversify-express-utils**: Some utilities for the development of express applications with Inversify.

### Tools
- **Vite**: A fast build tool for modern web development.
- **Postman**: For testing API endpoints.
- **pgAdmin**: For managing the PostgreSQL database.

---

## Setup Instructions

### Step 1: Extract the Shared Code
- Download  the project repository.
- Extract the shared code into your desired directory.

### Step 2: Configure the Database
1. **Install PostgreSQL**:
2. **Create a Database**:
   - Open terminal.
   - execute the query script available at db_script folder.
3. **Update Environment Variables**:
   - Navigate to the `backend` folder.
   - Open the `.env` file and update the following fields with your database credentials:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=student_management
     PORT=5000
     ```

### Step 3: Set Up the Backend
1. **Open Terminal**:
   - Open your terminal or command prompt.
2. **Navigate to the Backend Folder**:
   ```bash
   cd backend
3. **Install Dependencies:**:
   ```bash
   npm install
4. **Run the backend Application**:
   ```bash
   npm run dev
4. **Run the backend Application**:
   ```bash
   [http://localhost:5000/api/students](http://localhost:5000/api/students)

### Step 4: Set Up the Frontend
1. **Open Terminal**:
   - Open your terminal or command prompt.
2. **Navigate to the frontend Folder:**:
   ```bash
   cd backend
3. **Install Dependencies:**:
   ```bash
   npm install
4. **Run the Backend Application**:
   ```bash
   npm run dev
4. **Access the Application**:
   ```bash
   http://localhost:5173


