import React, { useState } from "react";

interface IngredientsTableProps {
  ingredients: any[];
  onAddToFridge: (ingredient: any) => void;
  onDelete: (id: number) => void;
}

const PAGE_SIZE = 10;

const IngredientsTable: React.FC<IngredientsTableProps> = ({ ingredients, onAddToFridge, onDelete }) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(ingredients.length / PAGE_SIZE);
  const pagedIngredients = ingredients.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <table className="full-width-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Default Unit</th>
            <th>Calories/Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pagedIngredients.map((ing) => (
            <tr key={ing.id}>
              <td>{ing.name}</td>
              <td>{ing.category}</td>
              <td>{ing.default_unit}</td>
              <td>{ing.calories_per_unit}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button title="Add to fridge" onClick={() => onAddToFridge(ing)} style={{ fontSize: '1.2em', padding: '0.2em 0.7em' }}>+</button>
                <button title="Delete ingredient" onClick={() => onDelete(ing.id)} style={{ fontSize: '1.2em', padding: '0.2em 0.7em', color: 'red' }}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>&lt;</button>
          <span className="page-counter">Page {page + 1} of {pageCount}</span>
          <button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page === pageCount - 1}>&gt;</button>
        </div>
      )}
    </>
  );
};

export default IngredientsTable;
