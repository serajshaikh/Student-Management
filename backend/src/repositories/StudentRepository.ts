import { injectable } from 'inversify';
import { Student } from '../models/Student';
import pool from '../config/database/db';

@injectable()
export class StudentRepository {
  
  async create(student: Student): Promise<Student> {
    try {
      const { name, email, date_of_birth } = student;
      console.log("Creating student:", student);
      
      const result = await pool.query(
        'INSERT INTO students (name, email, date_of_birth) VALUES ($1, $2, $3) RETURNING *',
        [name, email, date_of_birth]
      );

      return result.rows[0];
    } catch (error: any) {
      console.error('Error creating student:', error);
      
      if (error.code === '23505') {
        throw new Error('Email already exists. Please use a different email.');
      }
      
      throw new Error('Failed to create student. Please try again.');
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      const result = await pool.query('SELECT * FROM students');
      return result.rows;
    } catch (error: any) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to retrieve students.');
    }
  }

  async findById(id: string): Promise<Student | null> {
    try {
      const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error: any) {
      console.error(`Error fetching student with id ${id}:`, error);
      throw new Error('Failed to retrieve student.');
    }
  }

  async update(id: string, student: Student): Promise<Student | null> {
    try {
      const { name, email, date_of_birth } = student;
      
      const result = await pool.query(
        'UPDATE students SET name = $1, email = $2, date_of_birth = $3 WHERE id = $4 RETURNING *',
        [name, email, date_of_birth, id]
      );
      
      return result.rows[0] || null;
    } catch (error: any) {
      console.error(`Error updating student with id ${id}:`, error);
      throw new Error('Failed to update student.');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await pool.query('DELETE FROM students WHERE id = $1', [id]);
    } catch (error: any) {
      console.error(`Error deleting student with id ${id}:`, error);
      throw new Error('Failed to delete student.');
    }
  }
}
