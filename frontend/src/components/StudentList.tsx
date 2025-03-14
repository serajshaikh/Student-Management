// File: src/components/StudentList.tsx

import { useState, useEffect } from "react";
import { deleteStudent, getStudents } from "../services/api";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { IStudent } from "../interfaces/IStudent";
import { IApiResponse } from "../interfaces/IApiResponse";
import { PaginationControls } from "./utils/PaginationControls";
import { SearchBar } from "./utils/SearchBar";
import { MembersTable } from "./utils/MembersTable";

const MembersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [members, setMembers] = useState<IStudent[]>([]);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="table-container mt-3 border p-2 rounded bg-light">
      <h2>All Members</h2>
      <div className="d-flex justify-content-between mb-3 p-0">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
        <Button className="btn-sm w-25" variant="primary">Add New Member</Button>
      </div>
      <MembersTable members={members} handleDelete={handleDelete} />
      <PaginationControls
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
      />
    </div>
  );
};

export default MembersList;
