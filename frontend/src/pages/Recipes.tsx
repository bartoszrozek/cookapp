import React, { useEffect, useState } from "react";
import "../App.css";
import { fetchRecipes } from "../api";
import RecipesTable from "../components/RecipesTable";
import Modal from "../components/Modal";
import AddToMenuModal from "../components/AddToMenuModal";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState("none");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const modalInstructionsOpen: boolean = modalOpen === "instructions";
  const modalAddToMenuOpen: boolean = modalOpen === "addToMenu";
  const [menuAdding, setMenuAdding] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState({
    date: ''
  });

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (recipe: string, modal: string) => {
    setSelectedRecipe(recipe);
    setModalOpen(modal);
  };

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const prepareInstruction = (recipe: any) => {
    if (recipe?.instructions) {
      return recipe.instructions
    }
    if (recipe?.instruction_link) {
      return (
        <div>
          <iframe
            src={recipe.instruction_link}
            title="Recipe Instructions"
            style={{ width: "100%", height: "400px", border: "none" }}
          />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => window.open(recipe.instruction_link, "_blank", "noopener,noreferrer")}
              style={{ padding: "0.5em 1.5em" }}
            >
              Open in new tab
            </button>
          </div>
        </div>
      );
    }
    return "No description available!";
  }

  return (
    <>
      <h2>Recipes</h2>
      <div className="tab-modal-container">
        <div className="tab-content">
          {recipes.length === 0 ? (
            <div>No recipes found.</div>
          ) : (
            <RecipesTable recipes={recipes} onButtonsClick={openModal} />
          )}
        </div>
        <Modal open={modalInstructionsOpen && !!selectedRecipe} onClose={() => setModalOpen("none")} title={selectedRecipe ? `Instructions for ${selectedRecipe.name}` : undefined}>
          <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{prepareInstruction(selectedRecipe)}</div>
        </Modal>
        <AddToMenuModal
          open={modalAddToMenuOpen && !!selectedRecipe}
          onClose={() => setModalOpen("none")}
          // onSubmit={handleAddToMenu}
          menuAdding={menuAdding}
          menuError={menuError}
          menuForm={menuForm}
          // onInputChange={handleFridgeInputChange}
          recipeName={selectedRecipe?.name}
        />
      </div>
    </>
  );
};

export default Recipes;
