import React, { useState } from "react";

interface RecipesTableProps {
  recipes: any[];
  onShowInstructions: (recipe: any) => void;
}

const PAGE_SIZE = 10;

const RecipesTable: React.FC<RecipesTableProps> = ({ recipes, onShowInstructions }) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(recipes.length / PAGE_SIZE);
  const pagedRecipes = recipes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
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
          {pagedRecipes.map((rec) => (
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

export default RecipesTable;
