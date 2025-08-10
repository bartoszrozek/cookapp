import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { FaEye, FaCartPlus} from "react-icons/fa";

interface RecipesTableProps {
  recipes: any[];
  onButtonsClick: (recipe: string, modal: string) => void;
}

const RecipesTable: React.FC<RecipesTableProps> = ({ recipes, onButtonsClick }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pagedRecipes = recipes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Calculate the number of empty rows to fill the table to a fixed height
  const emptyRows = rowsPerPage - pagedRecipes.length;

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer>
        <Table className="full-width-table" stickyHeader aria-label="recipes table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Servings</TableCell>
              <TableCell>Prep Time</TableCell>
              <TableCell>Cook Time</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRecipes.map((rec) => (
              <TableRow hover key={rec.id}>
                <TableCell>{rec.name}</TableCell>
                <TableCell>{rec.description}</TableCell>
                <TableCell>{rec.servings}</TableCell>
                <TableCell>{rec.prep_time_min} min</TableCell>
                <TableCell>{rec.cook_time_min} min</TableCell>
                <TableCell>
                  <div className="fake-button" onClick={() => onButtonsClick(rec, "instructions")}>
                    <FaEye size={20}/>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="fake-button" onClick={() => onButtonsClick(rec, "addToSchedule")}>
                    <FaCartPlus  size={20}/>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, idx) => (
                <TableRow key={`empty-${idx}`} style={{ height: 59.8 }}>
                  <TableCell colSpan={6} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={recipes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RecipesTable;
