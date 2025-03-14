import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getStudents = async (page: number, limit: number, searchTerm?: string) => {
  const response = await axios.get(`${API_BASE_URL}/students`, {
    params: { page, limit, search: searchTerm },
  });
  return response.data;
};

export const getStudentById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/students/${id}`);
  return response.data;
};

export const createStudent = async (student: { name: string; email: string; date_of_birth: string }) => {
  const response = await axios.post(`${API_BASE_URL}/students`, student);
  return response.data;
};

export const updateStudent = async (id: number, student: { name: string; email: string; date_of_birth: string }) => {
  const response = await axios.put(`${API_BASE_URL}/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/students/${id}`);
};