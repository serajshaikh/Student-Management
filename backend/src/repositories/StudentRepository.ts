import { injectable } from 'inversify';
import { Student } from '../models/Student';
import pool from '../config/database/db';


@injectable()
export class StudentRepository {
  async create(student: Student): Promise<Student> {
    const { name, email, date_of_birth } = student;
    const result = await pool.query(
      'INSERT INTO students (name, email, date_of_birth) VALUES ($1, $2, $3) RETURNING *',
      [name, email, date_of_birth]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Student[]> {
    const result = await pool.query('SELECT * FROM students');
    return result.rows;
  }

  async findById(id: string): Promise<Student | null> {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async update(id: string, student: Student): Promise<Student | null> {
    const { name, email, date_of_birth } = student;
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2, date_of_birth = $3 WHERE id = $4 RETURNING *',
      [name, email, date_of_birth, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
  }
}