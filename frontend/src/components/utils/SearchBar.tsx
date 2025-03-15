import FormControl from "react-bootstrap/esm/FormControl";
import InputGroup from "react-bootstrap/esm/InputGroup";
interface ISearchBar {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setCurrentPage: (page: number) => void;
}
export const SearchBar = ({ searchTerm, setSearchTerm, setCurrentPage }:ISearchBar ) => (
  <InputGroup className="flex-grow-1" style={{ maxWidth: "300px" }}>
    <FormControl
      className="form-control-sm form-field-height"
      placeholder="Search by name or email"
      aria-label="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && setCurrentPage(1)}
    />
  </InputGroup>
);