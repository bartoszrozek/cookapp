import React, { useEffect, useState } from "react";
import "../App.css";
import { fetchRecipes } from "../api";
import RecipesTable from "../components/RecipesTable";
import Modal from "../components/modals/Modal";
import AddToScheduleModal from "../components/modals/AddToScheduleModal";
import AddRecipeModal from "../components/modals/AddRecipeModal";
import RecipeInstructionsModal from "../components/modals/RecipeInstructionsModal";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState("none");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const modalInstructionsOpen: boolean = modalOpen === "instructions";
  const modalAddToScheduleOpen: boolean = modalOpen === "addToSchedule";
  const [scheduleAdding, setScheduleAdding] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: ''
  });

  useEffect(() => {
    fetchRecipes()
      .then((data) => {
      setRecipes(data);
      // You can access the fetched recipes here as 'data'
      // For example, console.log(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  

  const openModal = (recipe: string, modal: string) => {
    setSelectedRecipe(recipe);
    setModalOpen(modal);
  };

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;


  return (
    <>
      <h2>Recipes</h2>
      <div className="tab-modal-container">
        <div className="tab-content">
          <div className="button-group">
            <button onClick={() => setModalOpen("addRecipe")} >Add Recipe</button>
          </div>
          {recipes.length === 0 ? (
            <div>No recipes found.</div>
          ) : (
            <RecipesTable recipes={recipes} onButtonsClick={openModal} />
          )}
        </div>
        <RecipeInstructionsModal
          open={modalInstructionsOpen && !!selectedRecipe}
          onClose={() => setModalOpen("none")}
          recipe={selectedRecipe}
        />
        <AddToScheduleModal
          open={modalAddToScheduleOpen && !!selectedRecipe}
          onClose={() => setModalOpen("none")}
          // onSubmit={handleAddToSchedule}
          scheduleAdding={scheduleAdding}
          scheduleError={scheduleError}
          scheduleForm={scheduleForm}
          // onInputChange={handleFridgeInputChange}
          recipeName={selectedRecipe?.name}
        />
        <AddRecipeModal
          open={modalOpen === "addRecipe"}
          onClose={() => setModalOpen("none")}
          onAdd={(recipe) => {
            setRecipes((prev) => [...prev, recipe]);
            setModalOpen("none");
          }}>
        </AddRecipeModal>
      </div>
    </>
  );
};

export default Recipes;
