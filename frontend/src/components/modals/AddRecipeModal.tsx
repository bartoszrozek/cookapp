import React, { useEffect, useReducer } from "react";
import Modal from "../modals/Modal";
import { addRecipe, updateRecipe, fetchIngredients } from "../../api";
import { FaMinusCircle, FaPlusCircle} from "react-icons/fa";
import DivButton from "../../components/DivButton";

import type { Ingredient } from "../../types/apiTypes";
import type { AddRecipeModalProps, AddRecipeState, Action, IngredientInputProps } from "../../types/Recipes.types";

const initialState: AddRecipeState = {
    name: "",
    description: "",
    instruction_link: "",
    instructions: "",
    servings: 1,
    prep_time_min: 0,
    cook_time_min: 0,
    difficulty: "easy",
    image_url: "",
    ingredients: []
};

function reducer(state: AddRecipeState, action: Action): AddRecipeState {
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
            return { ...state, ingredients: [...state.ingredients, { name: "", quantity: 0, unit: "" }] };
        case "remove_ingredient":
            return { ...state, ingredients: state.ingredients.filter((_, i) => i !== action.idx) };
        default:
            return { ...state, [action.type]: action.value };
    }
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ type, open, onClose, onSubmit, recipe}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [ingredients, setIngredients] = React.useState<Ingredient[]>();

    // Populate state with recipe data only when recipe changes
    useEffect(() => {
        if (recipe === null) {
            dispatch({ type: "reset", value: null });
            return;
        }
        if (recipe) {
            dispatch({ type: "reset", value: null });
            Object.keys(recipe).forEach(key => {
                if (key in initialState) {
                    dispatch({ type: key as keyof AddRecipeState, value: recipe[key as keyof AddRecipeState] });
                }
                if (key === "recipe_ingredients") {
                    const recipeIngredients = recipe.recipe_ingredients.map(ing => ({
                        name: ing.ingredient.name,
                        quantity: ing.quantity,
                        unit: ing.unit
                    }));
                    recipeIngredients.forEach((ing, idx) => {
                        dispatch({ type: "add_ingredient", value: null })
                        dispatch({ type: "ingredient_change", idx, field: "name", value: ing.name });
                        dispatch({ type: "ingredient_change", idx, field: "quantity", value: ing.quantity });
                        dispatch({ type: "ingredient_change", idx, field: "unit", value: ing.unit });
                    });
                }
            });
        }
    }, [recipe, type]);

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
            if (type === "edit" && recipe) {
                await updateRecipe(recipe.id, newRecipe)
            } else {
                await addRecipe(newRecipe);
            }
            onSubmit();
            dispatch({ type: "reset", value: null });
            onClose();
        } catch (err) {
            alert("Failed to add recipe. Please try again.");
        }
    };

    return (
        <Modal open={open} onClose={onClose} title={`${toTitleCase(type)} Recipe`}>
            <form className="modal-form" onSubmit={handleSubmit}>
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
                    <button type="submit">Submit</button>
                </div>
            </form>
        </Modal>
    );
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

interface ToTitleCase {
    (str: string): string;
}

const toTitleCase: ToTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        (text: string) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
};

export default AddRecipeModal;
