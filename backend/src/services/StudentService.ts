import { inject, injectable } from 'inversify';
import { Student } from '../models/Student';
import { StudentRepository } from '../repositories/StudentRepository';
import { TYPES } from '../di/Types';

@injectable()
export class StudentService {
  constructor(@inject(TYPES.StudentRepository) private studentRepository: StudentRepository) { }

  async createStudent(student: Student): Promise<Student> {
    return this.studentRepository.create(student);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(id: string): Promise<Student | null> {
    return this.studentRepository.findById(id);
  }

  async updateStudent(id: string, student: Student): Promise<Student | null> {
    return this.studentRepository.update(id, student);
  }

  async deleteStudent(id: string): Promise<void> {
    return this.studentRepository.delete(id);
  }
}