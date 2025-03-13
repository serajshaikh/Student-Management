import { injectable, inject } from 'inversify';
import pool from '../config/database/db';
import { IStudent } from '../models/IStudent';
import { IStudentRepository } from '../interfaces/IStudentRepository';
import { ILogger } from '../interfaces/ILogger';
import { TYPES } from '../di/Types';

@injectable()
export class StudentRepository implements IStudentRepository {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  async create(student: IStudent, trace_id?: string): Promise<IStudent> {
    try {
      const { name, email, date_of_birth } = student;
      this.logger.info(student, { description: "Creating new student", trace_id, ref: "StudentRepository:create" });
      
      const result = await pool.query(
        'INSERT INTO students (name, email, date_of_birth) VALUES ($1, $2, $3) RETURNING *',
        [name, email, date_of_birth]
      );

      this.logger.info(result.rows[0], { description: "Student created successfully", trace_id, ref: "StudentRepository:create" });
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(error, { description: "Error creating student", trace_id, ref: "StudentRepository:create" });
      throw new Error(error.code === '23505' ? 'Email already exists. Please use a different email.' : 'Failed to create student. Please try again.');
    }
  }

  async findAll(trace_id?: string): Promise<IStudent[]> {
    try {
      this.logger.info({}, { description: "Fetching all students", trace_id, ref: "StudentRepository:findAll" });
      
      const result = await pool.query('SELECT * FROM students');
      return result.rows;
    } catch (error: any) {
      this.logger.error(error, { description: "Error fetching students", trace_id, ref: "StudentRepository:findAll" });
      throw new Error('Failed to retrieve students.');
    }
  }

  async findById(id: string, trace_id?: string): Promise<IStudent | null> {
    try {
      this.logger.info({ id }, { description: "Fetching student by ID", trace_id, ref: "StudentRepository:findById" });
      
      const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error: any) {
      this.logger.error(error, { description: `Error fetching student with id ${id}`, trace_id, ref: "StudentRepository:findById" });
      throw new Error('Failed to retrieve student.');
    }
  }

  async update(id: string, student: IStudent, trace_id?: string): Promise<IStudent | null> {
    try {
      this.logger.info({ id, student }, { description: "Updating student details", trace_id, ref: "StudentRepository:update" });
      
      const { name, email, date_of_birth } = student;
      const result = await pool.query(
        'UPDATE students SET name = $1, email = $2, date_of_birth = $3 WHERE id = $4 RETURNING *',
        [name, email, date_of_birth, id]
      );
      
      return result.rows[0] || null;
    } catch (error: any) {
      this.logger.error(error, { description: `Error updating student with id ${id}`, trace_id, ref: "StudentRepository:update" });
      throw new Error('Failed to update student.');
    }
  }

  async delete(id: string, trace_id?: string): Promise<void> {
    try {
      this.logger.info({ id }, { description: "Deleting student", trace_id, ref: "StudentRepository:delete" });
      
      await pool.query('DELETE FROM students WHERE id = $1', [id]);
      this.logger.info({ id }, { description: "Student deleted successfully", trace_id, ref: "StudentRepository:delete" });
    } catch (error: any) {
      this.logger.error(error, { description: `Error deleting student with id ${id}`, trace_id, ref: "StudentRepository:delete" });
      throw new Error('Failed to delete student.');
    }
  }
}