import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import DivButton from "../components/DivButton";


interface IngredientsTableProps {
  ingredients: any[];
  onAddToFridge: (ingredient: any) => void;
  onDelete: (id: number) => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({ ingredients, onAddToFridge, onDelete }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortBy, setSortBy] = React.useState<'name' | 'category' | 'default_unit' | 'calories_per_unit'>("name");
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>("asc");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: 'name' | 'category' | 'default_unit' | 'calories_per_unit') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedIngredients = [...ingredients].sort((a, b) => {
    let aValue = a[sortBy] ?? "";
    let bValue = b[sortBy] ?? "";
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const pagedIngredients = sortedIngredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer>
        <Table className="full-width-table" stickyHeader aria-label="ingredients table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortBy === 'name' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'category' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'category'}
                  direction={sortBy === 'category' ? sortOrder : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'default_unit' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'default_unit'}
                  direction={sortBy === 'default_unit' ? sortOrder : 'asc'}
                  onClick={() => handleSort('default_unit')}
                >
                  Default Unit
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'calories_per_unit' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'calories_per_unit'}
                  direction={sortBy === 'calories_per_unit' ? sortOrder : 'asc'}
                  onClick={() => handleSort('calories_per_unit')}
                >
                  Calories/Unit
                </TableSortLabel>
              </TableCell>
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
                  <DivButton tooltip = "Add to fridge" onClick={() => onAddToFridge(ing)}><FaPlusCircle size={20}/></DivButton>
                </TableCell>
                <TableCell>
                  <DivButton tooltip = "Delete ingredient" onClick={() => onDelete(ing.id)}><FaMinusCircle size={20}/></DivButton>
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
