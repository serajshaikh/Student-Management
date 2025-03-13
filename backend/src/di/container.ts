import { Container } from 'inversify';

import { StudentRepository } from '../repositories/StudentRepository';
import { TYPES } from './Types';
import { StudentService } from '../services/StudentService';
import { StudentController } from '../controllers/StudentController';
import { ResponseHandler } from '../utils/error/ResponseHandler';
import { IStudentService } from '../interfaces/IStudentService';
import { IResponseHandler } from '../interfaces/IResponseHandler';

const container = new Container();

// Bind services and repositories
container.bind<StudentController>(TYPES.StudentController).to(StudentController).inSingletonScope();
container.bind<IStudentService>(TYPES.StudentService).to(StudentService).inSingletonScope();
container.bind<StudentRepository>(TYPES.StudentRepository).to(StudentRepository).inSingletonScope();
container.bind<IResponseHandler>(TYPES.ResponseHandler).to(ResponseHandler).inSingletonScope();

export { container };