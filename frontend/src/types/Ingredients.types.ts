export interface Ingredient {
  id: number;
  name: string;
  category: string;
  default_unit: string;
  calories_per_unit: number;
}

export interface NewIngredient {
  name: string;
  category: string;
  default_unit: string;
  calories_per_unit: number;
}

export interface FridgeForm {
  quantity: string;
  unit: string;
  expiration_date: string;
}

export interface AddIngredientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  adding: boolean;
  addError: string | null;
  newIngredient: {
    name: string;
    category: string;
    default_unit: string;
    calories_per_unit: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
