import React, { useEffect, useState } from "react";
import "../App.scss";
import { fetchRecipes } from "../api";
import RecipesTable from "../components/RecipesTable";
import Filter from "../components/Filter";
import AddRecipeModal from "../components/modals/AddRecipeModal";
import RecipeInstructionsModal from "../components/modals/RecipeInstructionsModal";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState("none");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const modalInstructionsOpen: boolean = modalOpen === "instructions";

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
            <div>
              <Filter
                elements={recipes}
                setFilteredElements={setFilteredRecipes}
                fields={["name"]} />
            </div>
            <div>
              <button onClick={() => {
                setSelectedRecipe(null);
                setModalOpen("addRecipe")
              }} >Add Recipe</button>
            </div>
          </div>
          {filteredRecipes.length === 0 ? (
            <div>No recipes found.</div>
          ) : (
            <RecipesTable
              recipes={filteredRecipes}
              onButtonsClick={openModal}
              onSubmit={() => fetchRecipes()
                .then((data) => {
                  setRecipes(data);
                })
              } />
          )}
        </div>
        <RecipeInstructionsModal
          open={modalInstructionsOpen && !!selectedRecipe}
          onClose={() => setModalOpen("none")}
          recipe={selectedRecipe}
        />
        <AddRecipeModal
          type={selectedRecipe ? "edit" : "add"}
          open={modalOpen === "addRecipe"}
          onClose={() => setModalOpen("none")}
          onSubmit={() => fetchRecipes()
            .then((data) => {
              setRecipes(data);
            })
          }
          recipe={selectedRecipe}>
        </AddRecipeModal>
      </div >
    </>
  );
};

export default Recipes;
