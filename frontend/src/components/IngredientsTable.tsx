import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

interface IngredientsTableProps {
  ingredients: any[];
  onAddToFridge: (ingredient: any) => void;
  onDelete: (id: number) => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({ ingredients, onAddToFridge, onDelete }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pagedIngredients = ingredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer>
        <Table className="full-width-table" stickyHeader aria-label="ingredients table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Default Unit</TableCell>
              <TableCell>Calories/Unit</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedIngredients.map((ing) => (
              <TableRow hover key={ing.id}>
                <TableCell>{ing.name}</TableCell>
                <TableCell>{ing.category}</TableCell>
                <TableCell>{ing.default_unit}</TableCell>
                <TableCell>{ing.calories_per_unit}</TableCell>
                <TableCell>
                  <button title="Add to fridge" onClick={() => onAddToFridge(ing)} style={{ fontSize: '1.2em', padding: '0.2em 0.7em' }}>+</button>
                  </TableCell>
                <TableCell>
                  <button title="Delete ingredient" onClick={() => onDelete(ing.id)} style={{ fontSize: '1.2em', padding: '0.2em 0.7em', color: 'red' }}>-</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={ingredients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default IngredientsTable;
