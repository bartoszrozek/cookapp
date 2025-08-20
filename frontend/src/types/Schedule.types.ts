import type { Recipe } from "../types/apiTypes";

export interface Schedule {
  id: number;
  recipe_id: number;
  user_id: number;
  date: string;
  meal_type: number;
  recipe_name?: string;
}

export interface ScheduleTableProps {
  weekStart: Date;
  weekEnd: Date;
  setModalOpen: React.Dispatch<React.SetStateAction<string>>;
  setModalData: (data: ModalDataType) => void;
  handleDeleteDish: (scheduleId: number) => void;
  setSelectedRecipe: (data: Recipe | null) => void;
}

export interface ModalDataType {
  date: string;
  mealTypeId: number;
}

export interface AddToScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  recipeName?: string;
}
