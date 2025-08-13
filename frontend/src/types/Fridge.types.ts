export interface AddToFridgeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  fridgeAdding: boolean;
  fridgeError: string | null;
  fridgeForm: {
    quantity: string;
    unit: string;
    expiration_date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ingredientName?: string;
}
