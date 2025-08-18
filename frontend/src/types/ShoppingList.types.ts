import type { ShoppingListItem } from "./apiTypes";

export interface ShoppingListTableProps {
  items: any[];
  onAddToFridge: (item: ShoppingListItem) => void;
}
