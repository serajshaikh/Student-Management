import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, requestBody } from 'inversify-express-utils';
import { StudentService } from '../services/StudentService';
import { inject } from 'inversify';
import { TYPES } from '../di/Types';
import { Request, Response } from 'express';
import { Student } from '../models/Student';

@controller('/api/students')
export class StudentController {
  constructor(@inject(TYPES.StudentService) private studentService: StudentService) {}

  @httpGet('/')
  async getAllStudents(req: Request, res: Response): Promise<void> {
    console.log("Get all students");
    const students = await this.studentService.getAllStudents();
    console.log("students data", students);
    res.status(200).send(students);
  }

  @httpGet('/:id')
  async getStudentById(@requestParam('id') id: string, req: Request, res: Response): Promise<void> {
    const student = await this.studentService.getStudentById(id);
    if (student) {
      res.status(200).send(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  }

  @httpPost('/')
  async createStudent(@requestBody() student: Student, req: Request, res: Response): Promise<void> {
    try {
      console.log("Request body:", student);
      const newStudent = await this.studentService.createStudent(student);
      console.log("newStudent:", newStudent);

      res.status(201).json(newStudent);
    } catch (error: any) {
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @httpPut('/:id')
  async updateStudent(@requestParam('id') id: string, @requestBody() student: Student, req: Request, res: Response): Promise<void> {
    const updatedStudent = await this.studentService.updateStudent(id, student);
    if (updatedStudent) {
      res.status(200).send(updatedStudent);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  }

  @httpDelete('/:id')
  async deleteStudent(@requestParam('id') id: string, req: Request, res: Response): Promise<void> {
    await this.studentService.deleteStudent(id);
    res.status(204).send();
  }
}
