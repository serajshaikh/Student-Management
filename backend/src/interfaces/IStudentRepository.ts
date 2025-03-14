import { IStudent } from '../models/IStudent';
import { ReqData } from '../utils/validate/RequestSchema';

export interface IStudentRepository {
  create(student: IStudent, trace_id?: string): Promise<IStudent>;
  createStudents(students: ReqData[], trace_id?: string): Promise<IStudent[]>
  findAll(page: number, limit: number, trace_id?: string): Promise<{ students: IStudent[]; totalCount: number }>;
  findById(id: string, trace_id?: string): Promise<IStudent | null>;
  update(id: string, student: IStudent, trace_id?: string): Promise<IStudent | null>;
  delete(id: string, trace_id?: string): Promise<void>;
}