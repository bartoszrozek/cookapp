import React from "react";
import Modal from "./Modal";

interface AddScheduleDishModalProps {
    open: boolean;
    onClose: () => void;
    date?: string;
    mealTypeId?: number;
    onSubmit: (recipeId: number, date: string, mealTypeId: number) => void;
    recipes: { id: number; name: string }[];
}

const AddScheduleDishModal: React.FC<AddScheduleDishModalProps> = ({ open, onClose, date, mealTypeId, onSubmit, recipes }) => {
    const [selectedRecipe, setSelectedRecipe] = React.useState<number | "">("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRecipe) {
            onSubmit(Number(selectedRecipe));
            setSelectedRecipe("");
        }
    };

    return (
        <Modal open={open} onClose={onClose} title={`Add Dish for ${date} (Meal Type ${mealTypeId})`}>
            <form className="modal-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                    <label>Select Recipe</label>
                    <select value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)} required>
                        <option value="">Select a recipe</option>
                        {recipes.map(recipe => (
                            <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" style={{ padding: "0.5em 1.5em" }}>Add</button>
            </form>
        </Modal>
    );
};

export default AddScheduleDishModal;
