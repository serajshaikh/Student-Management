import { useState, useEffect } from "react";
import { deleteStudent, getStudents, createStudent, updateStudent, getStudentById } from "../services/api";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { IStudent } from "../interfaces/IStudent";
import { IApiResponse } from "../interfaces/IApiResponse";
import { PaginationControls } from "./utils/PaginationControls";
import { SearchBar } from "./utils/SearchBar";
import { MembersTable } from "./utils/MembersTable";
import StudentForm from "./StudentForm";

/**
 * MembersList component displays a list of students with search, pagination, add, edit, and delete functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered MembersList component.
 */
const MembersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [members, setMembers] = useState<IStudent[]>([]);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<IStudent | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data: IApiResponse = await getStudents(currentPage, entriesPerPage, searchTerm);
        setMembers(data.students);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [currentPage, entriesPerPage, searchTerm]);

  const handleDelete = async (id: number) => {
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
      const data: IApiResponse = await getStudents(currentPage, entriesPerPage, searchTerm);
      setMembers(data.students);
      setPagination(data.pagination);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const student = await getStudentById(id);
      console.log(student);
      const formattedDate = student.date_of_birth.split("T")[0];
      setEditMember({ ...student, date_of_birth: formattedDate });
      setShowModal(true);
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch student details.", "error");
    }
  };

  const handleSaveStudent = async (studentData: Omit<IStudent, "id">) => {
    try {
      if (editMember) {
        // If editing, update existing student
        await updateStudent(editMember.id, studentData);
        Swal.fire("Success!", "Student updated successfully.", "success");
      } else {
        // If adding new, create student
        await createStudent(studentData);
        Swal.fire("Success!", "Student added successfully.", "success");
      }
      setShowModal(false);
      setEditMember(null); // Reset edit state
      const data: IApiResponse = await getStudents(currentPage, entriesPerPage, searchTerm);
      setMembers(data.students);
    } catch (error) {
      Swal.fire("Error!", "Failed to save student.", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="table-container mt-3 border p-2 rounded bg-light">
      <h2>All Members</h2>
      <div className="d-flex justify-content-between mb-3 p-0">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
        <Button
          className="btn-sm w-25"
          variant="primary"
          onClick={() => {
            setEditMember(null);  // Reset edit state when adding new member
            setShowModal(true);
          }}
        >
          Add New Member
        </Button>
      </div>
      <MembersTable members={members} handleDelete={handleDelete} handleEdit={handleEdit} />
      <PaginationControls
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
      />

      {/* Modal for StudentForm (Add / Edit Member) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMember ? "Edit Member" : "Add New Member"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm onSubmit={handleSaveStudent} initialData={editMember} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MembersList;
