import { injectable, inject } from 'inversify';
import format from 'pg-format';
import pool from '../config/database/db';
import { IStudent } from '../models/IStudent';
import { IStudentRepository } from '../interfaces/IStudentRepository';
import { ILogger } from '../interfaces/ILogger';
import { TYPES } from '../di/Types';
import { ReqData } from '../utils/validate/RequestSchema';
import { ServiceException } from '../utils/error/ServiceException';

/**
 * @description Repository class for handling student database operations.
 */
@injectable()
export class StudentRepository implements IStudentRepository {
  /**
   * @param {ILogger} logger - Logger instance for logging operations.
   */
  constructor(@inject(TYPES.Logger) private logger: ILogger) { }

  /**
   * @description Tests the database connection.
   * @returns {Promise<boolean>} Connection status.
   */
  async testConnection(): Promise<boolean> {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error(error, { description: "Database connection failed", ref: "StudentRepository:testConnection" });
      return false;
    }
  }
  
  /**
   * @description Creates a new student record in the database.
   * @param {IStudent} student - Student data to be inserted.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent>} The newly created student.
   */
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

  /**
   * @description Creates multiple students in bulk.
   * @param {ReqData[]} students - Array of students to be inserted.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent[]>} List of created students.
   */
  async createStudents(students: ReqData[], trace_id?: string): Promise<IStudent[]> {
    try {
      this.logger.info(students, { description: "Creating students in bulk", trace_id, ref: "StudentRepository:createStudents" });
      const values = students.map(({ name, email, date_of_birth }) => [name, email, date_of_birth]);

      const query = format(
        'INSERT INTO students (name, email, date_of_birth) VALUES %L RETURNING *',
        values
      );

      const result = await pool.query(query);

      this.logger.info(result.rows, { description: "Students created successfully", trace_id, ref: "StudentRepository:create" });

      return result.rows;
    } catch (error: any) {
      this.logger.error(error, { description: "Error creating students", trace_id, ref: "StudentRepository:create" });
      throw new ServiceException({ message: error.code === '23505' ? 'Duplicate email detected. Please use unique emails.' : 'Failed to create students. Please try again.', statusCode: 400, trace_id });
    }
  }

  /**
   * @description Fetches a paginated list of students with optional search.
   * @param {number} page - Page number.
   * @param {number} limit - Number of records per page.
   * @param {string} [search] - Optional search keyword.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<{ students: IStudent[]; totalCount: number }>} Paginated student data.
   */
  async findAll(page: number, limit: number, search?: string, trace_id?: string): Promise<{ students: IStudent[]; totalCount: number }> {
    try {
      this.logger.info({ page, limit, search }, { description: "Fetching students", trace_id, ref: "StudentRepository:findAll" });

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      if (isNaN(pageNumber) || isNaN(limitNumber)) {
        throw new ServiceException({ message: "Page and limit must be valid numbers.", statusCode: 422, trace_id });
      }

      const offset = (pageNumber - 1) * limitNumber;
      let whereClause = "";
      const params: any[] = [];

      if (search) {
        whereClause = " WHERE LOWER(name) LIKE $1 OR LOWER(email) LIKE $1";
        params.push(`%${search.toLowerCase()}%`);
      }

      const query = `SELECT * FROM students${whereClause} ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limitNumber, offset);

      const countQuery = `SELECT COUNT(*) FROM students${whereClause}`;
      const countParams = search ? [params[0]] : [];

      const studentsQuery = await pool.query(query, params);
      const totalCountQuery = await pool.query(countQuery, countParams);

      const totalCount = parseInt(totalCountQuery.rows[0].count, 10);

      return {
        students: studentsQuery.rows,
        totalCount,
      };
    } catch (error: any) {
      this.logger.error(error, { description: "Error fetching students", trace_id, ref: "StudentRepository:findAll" });
      throw new Error('Failed to retrieve students.');
    }
  }

  /**
   * @description Fetches a student by ID.
   * @param {string} id - Student ID.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent | null>} The student record, if found.
   */
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

  /**
   * @description Updates a student record.
   * @param {string} id - Student ID.
   * @param {IStudent} student - Updated student data.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent | null>} The updated student record, if found.
   */
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

  /**
   * @description Deletes a student record by ID.
   * @param {string} id - Student ID.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<void>}
   */
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
