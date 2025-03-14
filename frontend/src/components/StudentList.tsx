import { deleteStudent, getStudents } from "../services/api";
import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import {
  Form,
  Table,
  Pagination,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Swal from "sweetalert2";

interface Member {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
}
const MembersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Use the service function to fetch students
        const data = await getStudents(currentPage, entriesPerPage);
        setMembers(data.students); // Assuming the API returns { students: [], totalCount: number }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage, entriesPerPage]);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredMembers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalPages = Math.ceil(filteredMembers.length / entriesPerPage);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurrentPage(1); // Reset to the first page when searching
    }
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this student!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      await deleteStudent(id);
      Swal.fire("Deleted!", "Student has been deleted.", "success");
      const data = await getStudents(currentPage, entriesPerPage);
      setMembers(data.students);
    }
  };

  const calculateAge = (dob: string | Date): number => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };


  return (
    <div className="table-container mt-3 border p-2 rounded bg-light">
      <h2>All Members</h2>
      <div className="d-flex justify-content-between mb-3 p-0">
        <InputGroup className="flex-grow-1" style={{ maxWidth: "300px" }}>
          <FormControl
            className="form-control-sm form-field-height"
            placeholder="Search by name or email"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
        <Button className="btn-sm w-25" variant="primary">
          Add New Member
        </Button>
      </div>

      <div className="table-wrapper">
        <Table striped bordered hover className="table-content">
          <thead>
            <tr>
              <th>Id</th>
              <th>Member Name</th>
              <th>Member Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{calculateAge(member.date_of_birth)}</td>
                <td>
                  <MdDelete
                    className="text-danger fs-5 m-0"
                    onClick={() => handleDelete(member.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="pagination-container">
        <span className="d-flex align-items-center">
          Show
          <Form.Select
            style={{ width: "70px", margin: "0 5px" }}
            className="shadow-none focus-ring-0 border-1 form-field-height"
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Select>
          entries
        </span>

        <Pagination className="form-field-height">
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default MembersTable;
