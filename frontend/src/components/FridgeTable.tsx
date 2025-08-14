import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';

interface FridgeTableProps {
  items: any[];
}

const FridgeTable: React.FC<FridgeTableProps> = ({ items }) => {
  const [sortBy, setSortBy] = React.useState<'name' | 'quantity' | 'unit' | 'expiration_date'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'quantity' | 'unit' | 'expiration_date') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
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

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer>
        <Table className="full-width-table" stickyHeader aria-label="fridge table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortBy === 'name' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Ingredient
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
              <TableCell sortDirection={sortBy === 'expiration_date' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'expiration_date'}
                  direction={sortBy === 'expiration_date' ? sortOrder : 'asc'}
                  onClick={() => handleSort('expiration_date')}
                >
                  Expiration
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((item, idx) => {
              const showName = idx === 0 || item.name !== sortedItems[idx - 1].name;
              return (
                <TableRow hover key={item.id}>
                  <TableCell>{showName ? item.name : ""}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.expiration_date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FridgeTable;
