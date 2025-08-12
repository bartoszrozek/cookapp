import React, { useEffect, useReducer } from "react";
import Modal from "../modals/Modal";
import { addRecipe, fetchIngredients } from "../../api";
import { FaMinusCircle, FaPlusCircle} from "react-icons/fa";
import DivButton from "../../components/DivButton";

interface AddRecipeModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (recipe: any) => void;
}

const initialState = {
    name: "",
    description: "",
    instruction_link: "",
    instructions: "",
    servings: 1,
    prep_time_min: 0,
    cook_time_min: 0,
    difficulty: "easy",
    image_url: "",
    ingredients: [
        { name: "", quantity: "", unit: "" }
    ]
};

function reducer(state: typeof initialState, action: { type: string; value?: any; idx?: number; field?: string }) {
    switch (action.type) {
        case "reset":
            return initialState;
        case "ingredient_change": {
            const newIngredients = state.ingredients.map((ing, i) =>
                i === action.idx ? { ...ing, [action.field!]: action.value } : ing
            );
            return { ...state, ingredients: newIngredients };
        }
        case "add_ingredient":
            return { ...state, ingredients: [...state.ingredients, { name: "", quantity: "", unit: "" }] };
        case "remove_ingredient":
            return { ...state, ingredients: state.ingredients.filter((_, i) => i !== action.idx) };
        default:
            return { ...state, [action.type]: action.value };
    }
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ open, onClose, onAdd }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [ingredients, setIngredients] = React.useState<{ id: number; name: string; category: string; default_unit: string }[]>([]);

    useEffect(() => {
        fetchIngredients()
            .then(setIngredients);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newRecipe = {
                ...state,
                servings: Number(state.servings),
                prep_time_min: Number(state.prep_time_min),
                cook_time_min: Number(state.cook_time_min)
            };
            const result = await addRecipe(newRecipe);
            onAdd(result);
            dispatch({ type: "reset", value: null });
            onClose();
        } catch (err) {
            alert("Failed to add recipe. Please try again.");
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Add Recipe">
            <form className="add-recipe-form" onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input value={state.name} onChange={e => dispatch({ type: "name", value: e.target.value })} required />
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={state.description} onChange={e => dispatch({ type: "description", value: e.target.value })} />
                </div>
                <div>
                    <label>Instructions</label>
                    <textarea value={state.instructions} onChange={e => dispatch({ type: "instructions", value: e.target.value })} />
                </div>
                <div>
                    <label>Instruction Link</label>
                    <input value={state.instruction_link} onChange={e => dispatch({ type: "instruction_link", value: e.target.value })} />
                </div>
                <div>
                    <label>Servings</label>
                    <input type="number" min={1} value={state.servings} onChange={e => dispatch({ type: "servings", value: e.target.value })} required />
                </div>
                <div>
                    <label>Prep Time (min)</label>
                    <input type="number" min={0} value={state.prep_time_min} onChange={e => dispatch({ type: "prep_time_min", value: e.target.value })} required />
                </div>
                <div>
                    <label>Cook Time (min)</label>
                    <input type="number" min={0} value={state.cook_time_min} onChange={e => dispatch({ type: "cook_time_min", value: e.target.value })} required />
                </div>
                <div>
                    <label>Difficulty</label>
                    <select value={state.difficulty} onChange={e => dispatch({ type: "difficulty", value: e.target.value })}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div>
                    <label>Image URL</label>
                    <input value={state.image_url} onChange={e => dispatch({ type: "image_url", value: e.target.value })} />
                </div>
                <div>
                    <label>Ingredients</label>
                    {state.ingredients.map((ingredient, idx) => (
                        <IngredientInput
                            key={idx}
                            idx={idx}
                            ingredient={ingredient}
                            allIngredients={ingredients}
                            ingredientsLength={state.ingredients.length}
                            dispatch={dispatch}
                        />
                    ))}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                        <DivButton onClick={() => dispatch({ type: "add_ingredient", value: null })}>
                            <FaPlusCircle size={20} />
                        </DivButton>
                    </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <button type="submit">Add</button>
                </div>
            </form>
        </Modal>
    );
};

type IngredientInputProps = {
    idx: number;
    ingredient: { name: string; quantity: string; unit: string };
    allIngredients: [{ id: number; name: string, category: string, default_unit: string }];
    ingredientsLength: number;
    dispatch: React.Dispatch<{ type: string; value?: any; idx?: number; field?: string }>;
};

const IngredientInput: React.FC<IngredientInputProps> = ({ idx, ingredient, allIngredients, ingredientsLength, dispatch }) => (
    <div className="ingredient-row">
        <select
            value={ingredient.name}
            onChange={e => {
                // When selecting an ingredient, also update the unit if found in allIngredients
                const selectedName = e.target.value;
                const matched = allIngredients.find(ing => ing.name === selectedName);
                dispatch({ type: "ingredient_change", idx, field: "name", value: selectedName });
                if (matched && matched.default_unit) {
                    dispatch({ type: "ingredient_change", idx, field: "unit", value: matched.default_unit });
                }
                dispatch({ type: "ingredient_change", idx, field: "name", value: e.target.value })
            }}
            required
        >
            <option value="">Select ingredient</option>
            {allIngredients.map((ing: any) => (
                <option key={ing.id || ing.name} value={ing.name}>
                    {ing.name}
                </option>
            ))}
        </select>
        <input
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={e => dispatch({ type: "ingredient_change", idx, field: "quantity", value: e.target.value })}
            required
        />
        <input
            placeholder="Unit"
            value={ingredient.unit}
        />
        {ingredientsLength > 1 && (
            <DivButton
                onClick={() => dispatch({ type: "remove_ingredient", idx })}
                aria-label="Remove ingredient"
            >
                <FaMinusCircle size={20} />
            </DivButton>
        )}
    </div>
);

export default AddRecipeModal;
