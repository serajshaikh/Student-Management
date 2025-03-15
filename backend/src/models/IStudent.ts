export interface IStudent {
  id?: string;
  name: string;
  email: string;
  date_of_birth: Date;
  academic_details?: {
    subject: string;
    mark: number;
  }[];
}
