import React from "react";
import Modal from "./Modal";

interface RecipeInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  recipe: any;
}

const RecipeInstructionsModal: React.FC<RecipeInstructionsModalProps> = ({ open, onClose, recipe }) => {
  if (!recipe) return null;

  const ingredients = recipe?.recipe_ingredients?.length
    ? (
      <table style={{ marginBottom: 16, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "4px" }}>Ingredient</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "4px" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {recipe.recipe_ingredients.map((ing: any, idx: number) => (
            <tr key={idx}>
              <td style={{ padding: "4px" }}>{ing.ingredient.name}</td>
              <td style={{ padding: "4px" }}>{`${ing.quantity} ${ing.unit}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
    : null;

  let instructionsContent: React.ReactNode = ingredients;

  if (recipe?.instruction_link) {
    instructionsContent = (
      <>
        {ingredients}
        <div>
          <iframe
            src={recipe.instruction_link}
            title="Recipe Instructions"
            style={{ width: "100%", height: "300px", border: "none" }}
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
      </>
    );
  } else if (recipe?.instructions) {
    instructionsContent = (
      <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{recipe.instructions}</div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={recipe ? `Instructions for ${recipe.name}` : undefined}>
      {instructionsContent}
    </Modal>
  );
};

export default RecipeInstructionsModal;
