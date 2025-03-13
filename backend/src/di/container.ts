import { Container } from 'inversify';

import { StudentRepository } from '../repositories/StudentRepository';
import { TYPES } from './Types';
import { StudentService } from '../services/StudentService';
import { StudentController } from '../controllers/StudentController';

const container = new Container();

// Bind services and repositories
container.bind<StudentController>(TYPES.StudentController).to(StudentController).inSingletonScope();
container.bind<StudentService>(TYPES.StudentService).to(StudentService).inSingletonScope();
container.bind<StudentRepository>(TYPES.StudentRepository).to(StudentRepository).inSingletonScope();

export { container };