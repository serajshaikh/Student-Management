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
   * @description Creates a new student record in the database and add the marks of student if available, also connected with transaction.
   * @param {IStudent} student - Student data to be inserted.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent>} The newly created student.
   */
  async create(student: IStudent, trace_id?: string): Promise<IStudent> {
    const client = await pool.connect();
    try {
      const { name, email, date_of_birth, academic_details } = student;
      this.logger.info(student, { description: "Creating new student", trace_id, ref: "StudentRepository:create" });

      await client.query('BEGIN'); // Start transaction

      // Insert student record
      const studentQuery = 'INSERT INTO students (name, email, date_of_birth) VALUES ($1, $2, $3) RETURNING *';
      const studentResult = await client.query(studentQuery, [name, email, date_of_birth]);
      const newStudent = studentResult.rows[0];

      this.logger.info(newStudent, { description: "Student created successfully", trace_id, ref: "StudentRepository:create" });

      // Insert marks (only if academic_details exist)
      if (academic_details && academic_details.length > 0) {
        const values = academic_details.map(({ subject, mark }) => `(${newStudent.id}, '${subject}', ${mark})`).join(", ");
        const marksQuery = `INSERT INTO marks (student_id, subject, marks) VALUES ${values} RETURNING *;`;
        const marksResult = await client.query(marksQuery);

        this.logger.info(marksResult.rows, { description: "Marks added successfully", trace_id, ref: "StudentRepository:create" });
      } else {
        this.logger.info({ studentId: newStudent.id }, { description: "No marks provided", trace_id, ref: "StudentRepository:create" });
      }

      await client.query('COMMIT'); // Commit transaction
      return { ...newStudent, academic_details };
    } catch (error: any) {
      await client.query('ROLLBACK'); // Rollback transaction on failure
      this.logger.error(error, { description: "Error creating student", trace_id, ref: "StudentRepository:create" });
      throw new Error(`Failed to create student. Error: ${error.message}`);
    } finally {
      client.release(); // Release client back to pool
    }
  }



  /**
   * @description Creates multiple students in bulk along with their academic details.
   * @param {ReqData[]} students - Array of students with academic details.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent[]>} List of created students.
   */
  async createStudents(students: ReqData[], trace_id?: string): Promise<IStudent[]> {
    const client = await pool.connect();
    try {
      this.logger.info(students, { description: "Creating students in bulk", trace_id, ref: "StudentRepository:createStudents" });

      await client.query('BEGIN');

      // Insert students and get their IDs
      const studentValues = students.map(({ name, email, date_of_birth }) => [name, email, date_of_birth]);
      const studentQuery = format(
        'INSERT INTO students (name, email, date_of_birth) VALUES %L RETURNING *',
        studentValues
      );

      const studentResult = await client.query(studentQuery);
      const createdStudents = studentResult.rows;

      this.logger.info(createdStudents, { description: "Students created successfully", trace_id, ref: "StudentRepository:createStudents" });

      // Prepare marks insertion
      const marksValues: any[] = [];

      students.forEach((student, index) => {
        if (student.academic_details && student.academic_details.length > 0) {
          student.academic_details.forEach(({ subject, mark }) => {
            marksValues.push([createdStudents[index].id, subject, mark]);
          });
        }
      });

      // Insert marks if any
      if (marksValues.length > 0) {
        const marksQuery = format(
          'INSERT INTO marks (student_id, subject, marks) VALUES %L RETURNING *',
          marksValues
        );
        const marksResult = await client.query(marksQuery);

        this.logger.info(marksResult.rows, { description: "Marks added successfully", trace_id, ref: "StudentRepository:createStudents" });
      }

      await client.query('COMMIT');

      return createdStudents.map((student, index) => ({
        ...student,
        academic_details: students[index].academic_details || [],
      }));
    } catch (error: any) {
      await client.query('ROLLBACK');
      this.logger.error(error, { description: "Error creating students", trace_id, ref: "StudentRepository:createStudents" });
      throw new ServiceException({
        message: error.code === '23505' ? 'Duplicate email detected. Please use unique emails.' : 'Failed to create students. Please try again.',
        statusCode: 400,
        trace_id
      });
    } finally {
      client.release();
    }
  }



  /**
   * @description Fetches a paginated list of students along with their academic details.
   * @param {number} page - Page number.
   * @param {number} limit - Number of records per page.
   * @param {string} [search] - Optional search keyword.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<{ students: IStudent[]; totalCount: number }>} Paginated student data with academic details.
   */
  async findAll(page: number, limit: number, search?: string, trace_id?: string): Promise<{ students: IStudent[]; totalCount: number }> {
    try {
      this.logger.info({ page, limit, search }, { description: "Fetching students with academic details", trace_id, ref: "StudentRepository:findAll" });

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      if (isNaN(pageNumber) || isNaN(limitNumber)) {
        throw new ServiceException({ message: "Page and limit must be valid numbers.", statusCode: 422, trace_id });
      }

      const offset = (pageNumber - 1) * limitNumber;
      let whereClause = "";
      const params: any[] = [];

      if (search) {
        whereClause = "WHERE LOWER(s.name) LIKE $1 OR LOWER(s.email) LIKE $1";
        params.push(`%${search.toLowerCase()}%`);
      }

      // Fetch students with academic details, ensuring WHERE is applied before GROUP BY
      const query = `
        SELECT 
          s.id, s.name, s.email, s.date_of_birth,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object('subject', m.subject, 'mark', m.marks)
            ) FILTER (WHERE m.subject IS NOT NULL), '[]'
          ) AS academic_details
        FROM students s
        LEFT JOIN marks m ON s.id = m.student_id
        ${whereClause} 
        GROUP BY s.id
        ORDER BY s.id
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

      params.push(limitNumber, offset);

      // Count query (same WHERE clause)
      const countQuery = `SELECT COUNT(*) FROM students s ${whereClause}`;
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
      throw new ServiceException({ message: "Failed to retrieve students.", statusCode: 422, trace_id });
    }
  }



  /**
   * @description Fetches a student by ID, including academic details.
   * @param {string} id - Student ID.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent | null>} The student record, if found.
   */
  async findById(id: string, trace_id?: string): Promise<IStudent | null> {
    try {
      this.logger.info({ id }, { description: "Fetching student by ID", trace_id, ref: "StudentRepository:findById" });

      const query = `
      SELECT 
        s.id, s.name, s.email, s.date_of_birth,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('subject', m.subject, 'mark', m.marks)
          ) FILTER (WHERE m.subject IS NOT NULL), '[]'
        ) AS academic_details
      FROM students s
      LEFT JOIN marks m ON s.id = m.student_id
      WHERE s.id = $1
      GROUP BY s.id;
    `;

      const result = await pool.query(query, [id]);

      return result.rows[0] || null;
    } catch (error: any) {
      this.logger.error(error, { description: `Error fetching student with id ${id}`, trace_id, ref: "StudentRepository:findById" });
      throw new Error('Failed to retrieve student.');
    }
  }


  /**
   * @description Updates a student record along with academic details.
   * @param {string} id - Student ID.
   * @param {IStudent} student - Updated student data.
   * @param {string} [trace_id] - Optional trace ID for logging.
   * @returns {Promise<IStudent | null>} The updated student record, if found.
   */
  async update(id: string, student: IStudent, trace_id?: string): Promise<IStudent | null> {
    const client = await pool.connect();
    try {
      this.logger.info({ id, student }, { description: "Updating student details", trace_id, ref: "StudentRepository:update" });

      const { name, email, date_of_birth, academic_details } = student;

      await client.query('BEGIN');

      // Update student details
      const studentResult = await client.query(
        'UPDATE students SET name = $1, email = $2, date_of_birth = $3 WHERE id = $4 RETURNING *',
        [name, email, date_of_birth, id]
      );

      if (studentResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null; // Student not found
      }

      if (academic_details && academic_details.length >= 0) {
        // Remove existing academic details
        await client.query('DELETE FROM marks WHERE student_id = $1', [id]);
      }

      // Insert updated academic details (if provided)
      if (academic_details && academic_details.length > 0) {
        const values = academic_details.map(({ subject, mark }) => `(${id}, '${subject}', ${mark})`).join(", ");
        const marksQuery = `INSERT INTO marks (student_id, subject, marks) VALUES ${values}`;
        await client.query(marksQuery);
      }

      await client.query('COMMIT');

      return { ...studentResult.rows[0], academic_details };
    } catch (error: any) {
      await client.query('ROLLBACK');
      this.logger.error(error, { description: `Error updating student with id ${id}`, trace_id, ref: "StudentRepository:update" });
      throw new Error('Failed to update student.');
    } finally {
      client.release();
    }
  }


/**
 * @description Deletes a student record by ID along with their academic details.
 * @param {string} id - Student ID.
 * @param {string} [trace_id] - Optional trace ID for logging.
 * @returns {Promise<void>}
 */
async delete(id: string, trace_id?: string): Promise<void> {
  const client = await pool.connect();
  try {
    this.logger.info({ id }, { description: "Deleting student", trace_id, ref: "StudentRepository:delete" });

    await client.query('BEGIN');

    // Delete related academic details first (to maintain referential integrity)
    await client.query('DELETE FROM marks WHERE student_id = $1', [id]);

    // Delete student record
    const studentResult = await client.query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);

    if (studentResult.rowCount === 0) {
      await client.query('ROLLBACK');
      throw new Error(`Student with ID ${id} not found.`);
    }

    await client.query('COMMIT');
    this.logger.info({ id }, { description: "Student deleted successfully", trace_id, ref: "StudentRepository:delete" });
  } catch (error: any) {
    await client.query('ROLLBACK');
    this.logger.error(error, { description: `Error deleting student with id ${id}`, trace_id, ref: "StudentRepository:delete" });
    throw new Error('Failed to delete student.');
  } finally {
    client.release();
  }
}

}
