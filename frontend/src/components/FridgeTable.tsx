import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DivButton from "../components/DivButton";
import { updateFridgeItem, deleteFridgeItem } from "../api";


interface FridgeTableProps {
  items: any[];
  onSubmit: () => void;
}

const FridgeTable: React.FC<FridgeTableProps> = ({ items, onSubmit }) => {
  const [sortBy, setSortBy] = React.useState<'name' | 'quantity' | 'unit' | 'expiration_date'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [editRowId, setEditRowId] = React.useState<number | null>(null);
  const [editValues, setEditValues] = React.useState<{ quantity: string; unit: string; expiration_date: string }>({ quantity: '', unit: '', expiration_date: '' });

  const handleSort = (column: 'name' | 'quantity' | 'unit' | 'expiration_date') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const onDeleteItem = (item: any) => {
    if (window.confirm(`Are you sure you want to delete the item "${item.name}"?`)) {
      deleteFridgeItem(item.id)
        .then(() => {
          onSubmit()
        })
        .catch((e) => alert(`Failed to delete item: ${e}. Please try again.`));
    }
  }

  const onEditItem = (item: any) => {
    setEditRowId(item.id);
    setEditValues({
      quantity: String(item.quantity),
      unit: item.unit,
      expiration_date: item.expiration_date
    });
  };

  const onCancelEdit = () => {
    setEditRowId(null);
    setEditValues({ quantity: '', unit: '', expiration_date: '' });
  };

  const onSaveEdit = (item: any) => {
    // You should implement updateFridgeItem in your API
    updateFridgeItem(item.id, {
      ...item,
      quantity: editValues.quantity,
      unit: editValues.unit,
      expiration_date: editValues.expiration_date
    })
      .then(() => {
        setEditRowId(null);
        setEditValues({ quantity: '', unit: '', expiration_date: '' });
        onSubmit();
      })
      .catch(e => alert(`Failed to update item: ${e}. Please try again.`));
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
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((item, idx) => {
              const showName = idx === 0 || item.name !== sortedItems[idx - 1].name;
              const isEditing = editRowId === item.id;
              return (
                <TableRow hover key={item.id}>
                  <TableCell>{showName ? item.name : ""}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.quantity}
                        onChange={e => setEditValues(v => ({ ...v, quantity: e.target.value }))}
                        style={{ width: 100 }}
                      />
                    ) : item.quantity}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <input
                        value={editValues.unit}
                        onChange={e => setEditValues(v => ({ ...v, unit: e.target.value }))}
                        style={{ width: 100 }}
                      />
                    ) : item.unit}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editValues.expiration_date}
                        onChange={e => setEditValues(v => ({ ...v, expiration_date: e.target.value }))}
                        style={{ width: 140 }}
                      />
                    ) : (
                      <span className={new Date(item.expiration_date) < new Date() ? 'redCell' : ''}>
                        {item.expiration_date}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <>
                        <button type="button" onClick={() => onSaveEdit(item)} style={{ marginRight: 4 }}>Save</button>
                        <button type="button" onClick={onCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <DivButton tooltip="Edit" onClick={() => onEditItem(item)}>
                        <FaEdit size={20} />
                      </DivButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <DivButton tooltip="Delete item" onClick={() => onDeleteItem(item)}>
                      <FaTrashAlt size={20} />
                    </DivButton>
                  </TableCell>
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
