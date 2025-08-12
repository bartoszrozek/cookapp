import type { Recipe, Ingredient, IngredientInRecipe } from "./apiTypes";

export interface AddRecipeModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (recipe: Recipe) => void;
}

export type AddRecipeState = Omit<Recipe, "id" | "created_at" | "updated_at" | "recipe_ingredients"> & { ingredients: IngredientInRecipe[] };

export type Action = { type: string; value?: any; idx?: number; field?: string };

export type IngredientInputProps = {
    idx: number;
    ingredient: IngredientInRecipe;
    allIngredients: Ingredient[];
    ingredientsLength: number;
    dispatch: React.Dispatch<Action>;
};
