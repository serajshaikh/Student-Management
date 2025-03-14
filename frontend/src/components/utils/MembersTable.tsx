import { Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { IStudent } from "../../interfaces/IStudent";
import calculateAge from "../../utils/calculateAge";

interface IMembersTable {
  members: IStudent[],
  handleDelete: (id: number) => void
}

export const MembersTable = ({ members, handleDelete }: IMembersTable) => (
  <div className="table-wrapper">
    <Table striped bordered hover className="table-content">
      <thead >
        <tr>
          <th>Id</th>
          <th>Member Name</th>
          <th>Member Email</th>
          <th>Age</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member: IStudent) => (
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
);