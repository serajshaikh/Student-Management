import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, requestBody } from 'inversify-express-utils';
import { StudentService } from '../services/StudentService';
import { inject } from 'inversify';
import { TYPES } from '../di/Types';
import { Request, Response } from 'express';
import { Student } from '../models/Student';

@controller('/students')
export class StudentController {
  constructor(@inject(TYPES.StudentService) private studentService: StudentService) { }

  @httpGet('/')
  async getAllStudents(req: Request, res: Response): Promise<void> {
    const students = await this.studentService.getAllStudents();
    res.json(students);
  }

  @httpGet('/:id')
  async getStudentById(@requestParam('id') id: string, res: Response): Promise<void> {
    const student = await this.studentService.getStudentById(id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  }

  @httpPost('/')
  async createStudent(@requestBody() student: Student, res: Response): Promise<void> {
    const newStudent = await this.studentService.createStudent(student);
    res.status(201).json(newStudent);
  }

  @httpPut('/:id')
  async updateStudent( @requestParam('id') id: string, @requestBody() student: Student, res: Response): Promise<void> {
    const updatedStudent = await this.studentService.updateStudent(id, student);
    if (updatedStudent) {
      res.json(updatedStudent);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  }

  @httpDelete('/:id')
  async deleteStudent(@requestParam('id') id: string, res: Response): Promise<void> {
    await this.studentService.deleteStudent(id);
    res.status(204).send();
  }
}