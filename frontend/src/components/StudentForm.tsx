import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { IStudent } from '../types/IStudent';

interface StudentFormProps {
  initialData?: IStudent;
  onSubmit: (student: Omit<IStudent, 'id'>) => Promise<void>;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.date_of_birth || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ name, email, date_of_birth: dateOfBirth });
      Swal.fire('Success!', 'Student saved successfully.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to save student.', 'error');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="dateOfBirth">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
};

export default StudentForm;