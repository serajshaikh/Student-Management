import { IStudent } from "./IStudent";

export interface IApiResponse {
  pagination: {
    totalCount: number;
    currentPage: string;
    totalPages: number;
    limit: string;
  };
  students: IStudent[];
}