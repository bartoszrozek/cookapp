export interface Ingredient {
  id: number;
  name: string;
  category: string;
  default_unit: string;
  calories_per_unit: string;
}

export interface NewIngredient {
  name: string;
  category: string;
  default_unit: string;
  calories_per_unit: string;
}

export interface FridgeForm {
  quantity: string;
  unit: string;
  expiration_date: string;
}
