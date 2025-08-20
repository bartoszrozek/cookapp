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
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import DivButton from "../components/DivButton";
import type { RecipesTableProps } from "../types/Recipes.types";
import type { Recipe } from "../types/apiTypes";
import { deleteRecipe } from "../api";

const RecipesTable: React.FC<RecipesTableProps> = ({ recipes, onButtonsClick, onSubmit }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortBy, setSortBy] = React.useState<'name' | 'description' | 'servings' | 'prep_time_min' | 'cook_time_min'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: 'name' | 'description' | 'servings' | 'prep_time_min' | 'cook_time_min') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const onDeleteRecipe = (recipe: Recipe) => {
    if (window.confirm(`Are you sure you want to delete the recipe "${recipe.name}"?`)) {
      deleteRecipe(recipe.id)
        .then(() => {
          onSubmit();
        })
        .catch((e) => alert(`Failed to add recipe: ${e}. Please try again.`));
    }
  }

  const sortedRecipes = [...recipes].sort((a, b) => {
    let aValue = a[sortBy] ?? '';
    let bValue = b[sortBy] ?? '';
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const pagedRecipes = sortedRecipes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - pagedRecipes.length;

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer>
        <Table className="full-width-table" stickyHeader aria-label="recipes table">
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
              <TableCell sortDirection={sortBy === 'description' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'description'}
                  direction={sortBy === 'description' ? sortOrder : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'servings' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'servings'}
                  direction={sortBy === 'servings' ? sortOrder : 'asc'}
                  onClick={() => handleSort('servings')}
                >
                  Servings
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'prep_time_min' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'prep_time_min'}
                  direction={sortBy === 'prep_time_min' ? sortOrder : 'asc'}
                  onClick={() => handleSort('prep_time_min')}
                >
                  Prep Time
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'cook_time_min' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'cook_time_min'}
                  direction={sortBy === 'cook_time_min' ? sortOrder : 'asc'}
                  onClick={() => handleSort('cook_time_min')}
                >
                  Cook Time
                </TableSortLabel>
              </TableCell>
              <TableCell></TableCell>
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
                  <DivButton tooltip="See instructions" onClick={() => onButtonsClick(rec, "instructions")}> 
                    <FaEye size={20}/>
                  </DivButton>
                </TableCell>
                <TableCell>
                  <DivButton tooltip="Edit recipe" onClick={() => onButtonsClick(rec, "addRecipe")}> 
                    <FaEdit  size={20}/>
                  </DivButton>
                </TableCell>
                <TableCell>
                  <DivButton tooltip="Delete recipe" onClick={() => onDeleteRecipe(rec)}> 
                    <FaTrashAlt  size={20}/>
                  </DivButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, idx) => (
                <TableRow key={`empty-${idx}`} style={{ height: 49.3 }}>
                  <TableCell colSpan={9} />
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
