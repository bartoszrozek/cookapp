import React from "react";

interface IngredientsTableProps {
  ingredients: any[];
  onAddToFridge: (ingredient: any) => void;
  onDelete: (id: number) => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({ ingredients, onAddToFridge, onDelete }) => (
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
      {ingredients.map((ing) => (
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
);

export default IngredientsTable;
