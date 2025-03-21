import { inject, injectable } from 'inversify';
import { IStudent } from '../models/IStudent';
import { StudentRepository } from '../repositories/StudentRepository';
import { TYPES } from '../di/Types';
import { IStudentService } from '../interfaces/IStudentService';
import { ReqData } from '../utils/validate/RequestSchema';

@injectable()

export class StudentService implements IStudentService {
  constructor(@inject(TYPES.StudentRepository) private studentRepository: StudentRepository) { }

  async testDatabaseConnection(): Promise<boolean> {
    return this.studentRepository.testConnection();
  }

  async createStudent(student: IStudent, trace_id?: string): Promise<IStudent> {
    return this.studentRepository.create(student, trace_id);
  }

  createBulkStudents(students: ReqData[], trace_id?: string): Promise<IStudent[]> {
    return this.studentRepository.createStudents(students, trace_id);
  }

  async getAllStudents(page: number, limit: number, search?: string, trace_id?: string): Promise<{ students: IStudent[]; totalCount: number }> {
    return this.studentRepository.findAll(page, limit, search, trace_id);
  }

  async getStudentById(id: string, trace_id?: string): Promise<IStudent | null> {
    return this.studentRepository.findById(id, trace_id);
  }

  async updateStudent(id: string, student: IStudent, trace_id?: string): Promise<IStudent | null> {
    return this.studentRepository.update(id, student, trace_id);
  }

  async deleteStudent(id: string, trace_id?: string): Promise<void> {
    return this.studentRepository.delete(id, trace_id);
  }
}