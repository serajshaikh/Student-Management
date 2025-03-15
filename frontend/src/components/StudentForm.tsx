import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { IStudent } from "../interfaces/IStudent";

interface IStudentFormProps {
  onSubmit: (studentData: Omit<IStudent, "id">) => void;
  initialData?: IStudent | null;
}
/**
 * StudentForm component for adding or editing student details.
 *
 * @component
 * @param {IStudentFormProps} props - Component props.
 * @returns {JSX.Element} The rendered StudentForm component.
 */
const StudentForm = ({ onSubmit, initialData }: IStudentFormProps) => {
  const [formData, setFormData] = useState<Omit<IStudent, "id">>({
    name: "",
    email: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        date_of_birth: initialData.date_of_birth,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        {initialData ? "Update Member" : "Add Member"}
      </Button>
    </Form>
  );
};

export default StudentForm;
