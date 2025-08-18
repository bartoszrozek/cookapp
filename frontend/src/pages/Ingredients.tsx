import React, { useEffect, useState } from "react";
import "../App.scss";
import { fetchIngredients } from "../api";
import IngredientsTable from "../components/IngredientsTable";
import AddIngredientModal from "../components/modals/AddIngredientModal";
import AddToFridgeModal from "../components/modals/AddToFridgeModal";
import Filter from "../components/Filter";
import type { Ingredient, NewIngredient, FridgeForm } from "../types/Ingredients.types";

const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
    name: "",
    category: "",
    default_unit: "",
    calories_per_unit: ""
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState("none");
  const ingredientModalOpen = modalOpen == "ingredient"
  const fridgeModalOpen = modalOpen == "fridge";
  const [selectedIngredient, setSelectedIngredient] = useState<any | null>(null);
  const [fridgeForm, setFridgeForm] = useState<FridgeForm>({
    quantity: '',
    unit: '',
    expiration_date: ''
  });
  const [fridgeAdding, setFridgeAdding] = useState(false);
  const [fridgeError, setFridgeError] = useState<string | null>(null);

  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    fetchIngredients()
      .then(setIngredients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewIngredient({
      ...newIngredient,
      [e.target.name]: e.target.value
    });
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      const added = await import("../api").then(m => m.addIngredient(newIngredient));
      setIngredients((prev) => [...prev, added]);
      setNewIngredient({ name: "", category: "", default_unit: "", calories_per_unit: "" });
      setModalOpen("none");
    } catch (err: any) {
      setAddError(err.message || "Failed to add ingredient");
    } finally {
      setAdding(false);
    }
  };

  const openFridgeModal = (ingredient: any) => {
    setSelectedIngredient(ingredient);
    setFridgeForm({
      quantity: '',
      unit: ingredient.default_unit || '',
      expiration_date: ''
    });
    setModalOpen("fridge");
    setFridgeError(null);
  };

  const handleFridgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFridgeForm({
      ...fridgeForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      await import("../api").then(m => m.deleteIngredient(id));
      setIngredients((prev) => prev.filter((ing) => ing.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete ingredient");
    }
  };

  if (loading) return <div>Loading ingredients...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <>
      <h2>Ingredients</h2>
      <div className="tab-modal-container">
        <div className="tab-content">
          <div className="button-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Filter
              elements={ingredients}
              setFilteredElements={setFilteredIngredients}
              fields={["name", "category"]}/>
            <div>
              <button onClick={() => setModalOpen("ingredient")} >Add Ingredient</button>
            </div>
          </div>
          {ingredients.length === 0 ? (
            <div>No ingredients found.</div>
          ) : (
            <IngredientsTable
              ingredients={filteredIngredients}
              onAddToFridge={openFridgeModal}
              onDelete={handleDeleteIngredient}
            />
          )}
        </div>
        <AddIngredientModal
          open={ingredientModalOpen}
          onClose={() => setModalOpen("none")}
          onSubmit={handleAddIngredient}
          adding={adding}
          addError={addError}
          newIngredient={newIngredient}
          onInputChange={handleInputChange}
        />
        <AddToFridgeModal
          open={fridgeModalOpen && !!selectedIngredient}
          onClose={() => setModalOpen("none")}
          ingredient={selectedIngredient}
        />
      </div>
    </>
  );
};

export default Ingredients;
