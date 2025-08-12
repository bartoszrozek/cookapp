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
    calories_per_unit: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
