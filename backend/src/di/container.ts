import { Container } from 'inversify';

import { StudentRepository } from '../repositories/StudentRepository';
import { TYPES } from './Types';
import { StudentService } from '../services/StudentService';

const container = new Container();

// Bind services and repositories
container.bind<StudentService>(TYPES.StudentService).to(StudentService).inSingletonScope();
container.bind<StudentRepository>(TYPES.StudentRepository).to(StudentRepository).inSingletonScope();;

export { container };