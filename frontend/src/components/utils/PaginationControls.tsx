import Form from "react-bootstrap/esm/Form";
import Pagination from "react-bootstrap/esm/Pagination";
interface IPaginationControls {
  pagination: { totalCount: number, totalPages: number },
  currentPage: number,
  setCurrentPage: (page: number) => void,
  entriesPerPage: number,
  setEntriesPerPage: (entries: number) => void,
}
export const PaginationControls = ({ pagination, currentPage, setCurrentPage, entriesPerPage, setEntriesPerPage }: IPaginationControls) => (
  <div className="pagination-container d-flex justify-content-between align-items-center">
    <span className="d-flex align-items-center">
      Show
      <Form.Select
        style={{ width: "70px", margin: "0 5px" }}
        className="shadow-none focus-ring-0 border-1 form-field-height"
        value={entriesPerPage}
        onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      >
        {[5, 10, 25, 50, 100].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
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
      {Array.from({ length: pagination.totalPages }, (_, i) => (
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
        disabled={currentPage === pagination.totalPages}
      />
      <Pagination.Last
        onClick={() => setCurrentPage(pagination.totalPages)}
        disabled={currentPage === pagination.totalPages}
      />
    </Pagination>
  </div>
);
