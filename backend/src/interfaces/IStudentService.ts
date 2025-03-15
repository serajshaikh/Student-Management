import { IStudent } from "../models/IStudent";
import { ReqData } from "../utils/validate/RequestSchema";

export interface IStudentService {
    testDatabaseConnection(): Promise<boolean>
    createStudent(student: IStudent, trace_id?: string): Promise<IStudent>;
    createBulkStudents(students: ReqData[], trace_id?: string): Promise<IStudent[]>
    getAllStudents(page: number, limit: number, search?: string, trace_id?: string): Promise<{ students: IStudent[]; totalCount: number }>;
    getStudentById(id: string, trace_id?: string): Promise<IStudent | null>;
    updateStudent(id: string, student: IStudent, trace_id?: string): Promise<IStudent | null>;
    deleteStudent(id: string, trace_id?: string): Promise<void>;
}
