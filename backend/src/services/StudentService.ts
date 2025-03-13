import { inject, injectable } from 'inversify';
import { IStudent } from '../models/IStudent';
import { StudentRepository } from '../repositories/StudentRepository';
import { TYPES } from '../di/Types';
import { IStudentService } from '../interfaces/IStudentService';

@injectable()
export class StudentService implements IStudentService {
  constructor(@inject(TYPES.StudentRepository) private studentRepository: StudentRepository) { }

  async createStudent(student: IStudent): Promise<IStudent> {
    return this.studentRepository.create(student);
  }

  async getAllStudents(): Promise<IStudent[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(id: string): Promise<IStudent | null> {
    return this.studentRepository.findById(id);
  }

  async updateStudent(id: string, student: IStudent): Promise<IStudent | null> {
    return this.studentRepository.update(id, student);
  }

  async deleteStudent(id: string): Promise<void> {
    return this.studentRepository.delete(id);
  }
}