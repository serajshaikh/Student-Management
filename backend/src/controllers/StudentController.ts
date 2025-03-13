import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../di/Types';
import { Request, Response } from 'express';
import { IStudent } from '../models/IStudent';
import { IStudentService } from '../interfaces/IStudentService';
import { IResponseHandler } from '../interfaces/IResponseHandler';
import { IStudentController } from '../interfaces/IStudentController';
import { ServiceException } from '../utils/error/ServiceException';
import { ReqData, ReqSchema } from '../utils/validate/RequestSchema';
import { CommonUtils } from '../utils/CommonUtils';

@controller('/api/students')
export class StudentController implements IStudentController {
  constructor(
    @inject(TYPES.StudentService) private studentService: IStudentService,
    @inject(TYPES.ResponseHandler) private responseHandler: IResponseHandler
  ) { }

  @httpGet('/')
  async getAllStudents(req: Request, res: Response): Promise<void> {
    try {
      const traceId = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string
      const students = await this.studentService.getAllStudents();
      this.responseHandler.success({ responseData: students, statusCode: 200, response: res });
    } catch (error) {
      this.responseHandler.failure({ response: res, error });
    }
  }

  @httpGet('/:id')
  async getStudentById(@requestParam('id') id: string, req: Request, res: Response): Promise<void> {
    try {
      const traceId = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string

      const student = await this.studentService.getStudentById(id);
      if (!student) {
        throw new ServiceException({ message: "Student not found", traceId, statusCode: 404 });
      }
      this.responseHandler.success({ responseData: student, statusCode: 200, response: res });
    } catch (error) {
      this.responseHandler.failure({ response: res, error });
    }
  }

  @httpPost('/')
  async createStudent(@requestBody() student: IStudent, req: Request, res: Response): Promise<void> {
    const traceId = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string;
    
    try {
      const studentPayload = {
        ...student,
        date_of_birth: student.date_of_birth instanceof Date
          ? student.date_of_birth.toISOString().split('T')[0] 
          : student.date_of_birth
      };
  
      this.responseHandler.validate<ReqData>({ schema: ReqSchema, payload: studentPayload }, traceId);
  
      const newStudent = await this.studentService.createStudent(student);
      this.responseHandler.success({ responseData: newStudent, statusCode: 201, response: res });
      
    } catch (error) {
      console.log(JSON.stringify(error));
      this.responseHandler.failure({ response: res, error });
    }
  }
  

  @httpPut('/:id')
  async updateStudent(@requestParam('id') id: string, @requestBody() student: IStudent, req: Request, res: Response): Promise<void> {
    try {
      const traceId = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string
      const studentPayload = {
        ...student,
        date_of_birth: student.date_of_birth instanceof Date
          ? student.date_of_birth.toISOString().split('T')[0] 
          : student.date_of_birth
      };
      
      this.responseHandler.validate<ReqData>({ schema: ReqSchema, payload: studentPayload }, traceId);

      const updatedStudent = await this.studentService.updateStudent(id, student);
      if (!updatedStudent) {
        throw new ServiceException({ message: "Student not found", traceId, statusCode: 404 });
      }
      this.responseHandler.success({ responseData: updatedStudent, statusCode: 200, response: res });
    } catch (error) {
      this.responseHandler.failure({ response: res, error });
    }
  }

  @httpDelete('/:id')
  async deleteStudent(@requestParam('id') id: string, req: Request, res: Response): Promise<void> {
    try {
      const traceId = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string
      await this.studentService.deleteStudent(id);
      this.responseHandler.success({ responseData: null, statusCode: 204, response: res });
    } catch (error) {
      this.responseHandler.failure({ response: res, error });
    }
  }
}
