import { IStudent } from "../models/IStudent";
import { Request, Response } from 'express';

export interface IStudentController {
    testDatabaseConnection(req: Request, res: Response): Promise<void>;
    getAllStudents(page: number, limit: number, search: string, req: Request, res: Response): Promise<void>;
    getStudentById(id: string, req: Request, res: Response): Promise<void>;
    createStudent(student: IStudent, req: Request, res: Response): Promise<void>;
    createBulkStudents(students: IStudent[], req: Request, res: Response): Promise<void>
    updateStudent(id: string, student: IStudent, req: Request, res: Response): Promise<void>;
    deleteStudent(id: string, req: Request, res: Response): Promise<void>;
}
