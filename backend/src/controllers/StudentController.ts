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
import { ILogger } from '../interfaces/ILogger';

@controller('/api/students')
export class StudentController implements IStudentController {
  constructor(
    @inject(TYPES.StudentService) private studentService: IStudentService,
    @inject(TYPES.ResponseHandler) private responseHandler: IResponseHandler,
    @inject(TYPES.Logger) private logger: ILogger
  ) { }

  @httpGet('/')
  async getAllStudents(req: Request, res: Response): Promise<void> {
    const trace_id = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string;
    
    this.logger.info({}, { description: "Fetching all students", trace_id, ref: "StudentController:getAllStudents" });

    try {
      const students = await this.studentService.getAllStudents();
      this.responseHandler.success({ responseData: students, statusCode: 200, response: res });
    } catch (error) {
      this.logger.error(error, { description: "Error fetching students", trace_id, ref: "StudentController:getAllStudents" });
      this.responseHandler.failure({ response: res, error });
    }
  }

  @httpGet('/:id')
  async getStudentById(@requestParam('id') id: string, req: Request, res: Response): Promise<void> {
    const trace_id = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string;

    this.logger.info({ id }, { description: "Fetching student by ID", trace_id, ref: "StudentController:getStudentById" });

    try {
      const student = await this.studentService.getStudentById(id);
      if (!student) {
        throw new ServiceException({ message: "Student not found", trace_id, statusCode: 404 });
      }
      this.responseHandler.success({ responseData: student, statusCode: 200, response: res });
    } catch (error) {
      this.logger.error(error, { description: "Error fetching student by ID", trace_id, ref: "StudentController:getStudentById" });
      this.responseHandler.failure({ response: res, error });
    }
  }

  @httpPost('/')
  async createStudent(@requestBody() student: IStudent, req: Request, res: Response): Promise<void> {
    const trace_id = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string;
    
    this.logger.info(student, { description: "Creating new student", trace_id, ref: "StudentController:createStudent" });

    try {
      const studentPayload = {
        ...student,
        date_of_birth: student.date_of_birth instanceof Date
          ? student.date_of_birth.toISOString().split('T')[0] 
          : student.date_of_birth
      };
  
      this.responseHandler.validate<ReqData>({ schema: ReqSchema, payload: studentPayload }, trace_id);
  
      const newStudent = await this.studentService.createStudent(student);
      this.logger.info(newStudent, { description: "Student created successfully", trace_id, ref: "StudentController:createStudent" });

      this.responseHandler.success({ responseData: newStudent, statusCode: 201, response: res });
      
    } catch (error) {
      this.logger.error(error, { description: "Error creating student", trace_id, ref: "StudentController:createStudent" });
      this.responseHandler.failure({ response: res, error });
    }
  }
  

  @httpPut('/:id')
  async updateStudent(@requestParam('id') id: string, @requestBody() student: IStudent, req: Request, res: Response): Promise<void> {
    const trace_id = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string;
    
    this.logger.info({ id, student }, { description: "Updating student details", trace_id, ref: "StudentController:updateStudent" });

    try {
      const studentPayload = {
        ...student,
        date_of_birth: student.date_of_birth instanceof Date
          ? student.date_of_birth.toISOString().split('T')[0] 
          : student.date_of_birth
      };
      
      this.responseHandler.validate<ReqData>({ schema: ReqSchema, payload: studentPayload }, trace_id);

      const updatedStudent = await this.studentService.updateStudent(id, student);
      if (!updatedStudent) {
        throw new ServiceException({ message: "Student not found", trace_id, statusCode: 404 });
      }

      this.logger.info(updatedStudent, { description: "Student updated successfully", trace_id, ref: "StudentController:updateStudent" });

      this.responseHandler.success({ responseData: updatedStudent, statusCode: 200, response: res });
    } catch (error) {
      this.logger.error(error, { description: "Error updating student", trace_id, ref: "StudentController:updateStudent" });
      this.responseHandler.failure({ response: res, error });
    }
  }

  @httpDelete('/:id')
  async deleteStudent(@requestParam('id') id: string, req: Request, res: Response): Promise<void> {
    const trace_id = (req.headers?.['X-App-Trace-Id'] ?? CommonUtils.genUlid("trx")) as string;
    
    this.logger.info({ id }, { description: "Deleting student", trace_id, ref: "StudentController:deleteStudent" });

    try {
      await this.studentService.deleteStudent(id);
      this.logger.info({ id }, { description: "Student deleted successfully", trace_id, ref: "StudentController:deleteStudent" });

      this.responseHandler.success({ responseData: null, statusCode: 204, response: res });
    } catch (error) {
      this.logger.error(error, { description: "Error deleting student", trace_id, ref: "StudentController:deleteStudent" });
      this.responseHandler.failure({ response: res, error });
    }
  }
}
