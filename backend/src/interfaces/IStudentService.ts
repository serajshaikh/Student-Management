import { IStudent } from "../models/IStudent";

export interface IStudentService {
    createStudent(student: IStudent): Promise<IStudent>;
    getAllStudents(): Promise<IStudent[]>;
    getStudentById(id: string): Promise<IStudent | null>;
    updateStudent(id: string, student: IStudent): Promise<IStudent | null>;
    deleteStudent(id: string): Promise<void>;
}
