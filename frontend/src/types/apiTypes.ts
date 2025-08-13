// --- TypeScript Schemas for API Return Types ---
export interface IngredientInRecipe {
  name: string;
  quantity: number;
  unit: string;
}
export interface Ingredient {
  id: number;
  name: string;
  category?: string;
  default_unit?: string;
  calories_per_unit?: number;
  is_perishable?: boolean;
  shelf_life_days?: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  quantity: number;
  unit: string;
  optional?: boolean;
  ingredient: IngredientShort;
}

export interface IngredientShort {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  instructions?: string;
  instruction_link?: string;
  servings?: number;
  prep_time_min?: number;
  cook_time_min?: number;
  difficulty?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  recipe_ingredients: RecipeIngredient[];
}

export interface FridgeItem {
  id: number;
  user_id: number;
  ingredient_id: number;
  quantity: number;
  unit: string;
  expiration_date?: string;
  added_at: string;
  updated_at: string;
}

export interface MealType {
  id: number;
  name: string;
}

export type AddRecipeState = Omit<Recipe, "id" | "created_at" | "updated_at" | "recipe_ingredients"> & { ingredients: IngredientInRecipe[] };