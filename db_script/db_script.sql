
-- Log into the PostgreSQL shell
psql -U postgres
--password: ******** 


-- Create database
CREATE DATABASE student_management;
\c student_management; -- Connect to the database

-- Create Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Marks Table
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE, -- Foreign key to students table
    subject VARCHAR(100) NOT NULL,
    marks INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);