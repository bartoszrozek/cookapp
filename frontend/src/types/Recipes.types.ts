import type { Recipe, Ingredient, IngredientInRecipe } from "./apiTypes";

export interface RecipesTableProps {
  recipes: any[];
  onButtonsClick: (recipe: string, modal: string) => void;
  onSubmit: () => void;
}

export interface AddRecipeModalProps {
    type: "add" | "edit";
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    recipe?: Recipe;}

export type AddRecipeState = Omit<Recipe, "id" | "created_at" | "updated_at" | "recipe_ingredients"> & { ingredients: IngredientInRecipe[] };

export type Action = { type: string; value?: any; idx?: number; field?: string };

export type IngredientInputProps = {
    idx: number;
    ingredient: IngredientInRecipe;
    allIngredients: Ingredient[];
    ingredientsLength: number;
    dispatch: React.Dispatch<Action>;
};
