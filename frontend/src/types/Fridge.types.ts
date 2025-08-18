import type { FridgeItem } from "../types/apiTypes";
import type { Ingredient } from "./Ingredients.types";

export interface AddToFridgeModalProps {
  open: boolean;
  onClose: () => void;
  ingredient: Ingredient;
  defaultQuantity?: number;
  defaultUnit?: string;
}

export type AddFridgeItemState = Omit<FridgeItem, "id" | "created_at" | "updated_at" | "user_id">;
