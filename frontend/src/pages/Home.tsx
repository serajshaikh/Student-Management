import React from 'react';
import StudentList from '../components/StudentList';
// import StudentForm from '../components/StudentForm';
// import { createStudent } from '../services/api';
// import { IStudent } from '../types/IStudent';

const Home: React.FC = () => {
  // const handleCreateStudent = async (student: Omit<IStudent, 'id'>) => {
  //   await createStudent(student);
  // };

  return (
    <div>
      <h1>Student Management</h1>
      {/* <StudentForm onSubmit={handleCreateStudent} /> */}
      <StudentList />
    </div>
  );
};

export default Home;