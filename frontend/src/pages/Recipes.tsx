import React, { useEffect, useState } from "react";
import "../App.css";
import { fetchRecipes } from "../api";
import RecipesTable from "../components/RecipesTable";
import Modal from "../components/Modal";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openInstructionsModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <>
      <h2>Recipes</h2>
      <div className="tab-content">
        {recipes.length === 0 ? (
          <div>No recipes found.</div>
        ) : (
          <RecipesTable recipes={recipes} onShowInstructions={openInstructionsModal} />
        )}
        <Modal open={modalOpen && !!selectedRecipe} onClose={() => setModalOpen(false)} title={selectedRecipe ? `Instructions for ${selectedRecipe.name}` : undefined}>
          <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{selectedRecipe?.instructions || 'No instructions provided.'}</div>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.5em 1.5em' }}>Close</button>
        </Modal>
      </div>
    </>
  );
};

export default Recipes;
