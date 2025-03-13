import { IStudent } from '../models/IStudent';

export interface IStudentRepository {
  create(student: IStudent, trace_id?: string): Promise<IStudent>;
  findAll(trace_id?: string): Promise<IStudent[]>;
  findById(id: string, trace_id?: string): Promise<IStudent | null>;
  update(id: string, student: IStudent, trace_id?: string): Promise<IStudent | null>;
  delete(id: string, trace_id?: string): Promise<void>;
}