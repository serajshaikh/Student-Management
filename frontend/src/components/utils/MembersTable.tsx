import { Tooltip, OverlayTrigger, Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { IStudent } from "../../interfaces/IStudent";
import calculateAge from "../../utils/calculateAge";
import { TbEdit } from "react-icons/tb";

interface IMembersTable {
  members: IStudent[];
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
}

export const MembersTable = ({ members, handleDelete, handleEdit }: IMembersTable) => (
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
        {members.map((member: IStudent) => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{calculateAge(member.date_of_birth)}</td>
            <td className="d-flex gap-3">
              {/* Edit Tooltip */}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="custom-tooltip">Edit Member</Tooltip>}
              >
                <TbEdit
                  className="text-primary fs-5 m-0 edit-icon"
                  onClick={() => handleEdit(member.id)}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>

              {/* Delete Tooltip */}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="custom-tooltip">Delete Member</Tooltip>}
              >
                <MdDelete
                  className="text-danger fs-5 m-0 delete-icon"
                  onClick={() => handleDelete(member.id)}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);
