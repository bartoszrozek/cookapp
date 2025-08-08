import React from "react";

interface RecipesTableProps {
  recipes: any[];
  onShowInstructions: (recipe: any) => void;
}

const RecipesTable: React.FC<RecipesTableProps> = ({ recipes, onShowInstructions }) => (
  <table className="full-width-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Servings</th>
        <th>Prep Time</th>
        <th>Cook Time</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {recipes.map((rec) => (
        <tr key={rec.id}>
          <td>{rec.name}</td>
          <td>{rec.description}</td>
          <td>{rec.servings}</td>
          <td>{rec.prep_time_min} min</td>
          <td>{rec.cook_time_min} min</td>
          <td>
            <button onClick={() => onShowInstructions(rec)} style={{ padding: '0.3em 1em' }}>Instructions</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RecipesTable;
