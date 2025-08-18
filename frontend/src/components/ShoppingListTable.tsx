
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
import type { ShoppingListTableProps } from "../types/ShoppingList.types";
import DivButton from "./DivButton";
import { FaPlusCircle } from "react-icons/fa";

const ShoppingListTable: React.FC<ShoppingListTableProps> = ({ items, onAddToFridge }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortBy, setSortBy] = React.useState<'ingredient_name' | 'quantity' | 'unit'>('ingredient_name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: 'ingredient_name' | 'quantity' | 'unit') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Group items by ingredient and unit, summing quantity
  const groupedItems: any = items.reduce((acc, item) => {
    const key = `${item.ingredient_name}-${item.unit}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += item.quantity;
    return acc;
  }, {});

  const sortedItems = Object.values(groupedItems).sort((a: any, b: any) => {
    let aValue = a[sortBy] ?? '';
    let bValue = b[sortBy] ?? '';
    if (sortBy === 'quantity') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const pagedItems = sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - pagedItems.length;

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer>
        <Table className="full-width-table" stickyHeader aria-label="shopping list table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortBy === 'ingredient_name' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'ingredient_name'}
                  direction={sortBy === 'ingredient_name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('ingredient_name')}
                >
                  Item
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'quantity' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'quantity'}
                  direction={sortBy === 'quantity' ? sortOrder : 'asc'}
                  onClick={() => handleSort('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === 'unit' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'unit'}
                  direction={sortBy === 'unit' ? sortOrder : 'asc'}
                  onClick={() => handleSort('unit')}
                >
                  Unit
                </TableSortLabel>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedItems.map((item: any) => (
              <TableRow hover key={`${item.ingredient_name}-${item.unit}`}>
                <TableCell>{item.ingredient_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  <DivButton tooltip = "Add to fridge" onClick={() => onAddToFridge(item)}><FaPlusCircle size={20}/></DivButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, idx) => (
                <TableRow key={`empty-${idx}`} style={{ height: 49.3 }}>
                  <TableCell colSpan={3} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
export default ShoppingListTable;
