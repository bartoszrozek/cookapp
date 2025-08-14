import type { Ingredient, Recipe, FridgeItem, MealType, Schedule } from "./types/apiTypes";
// API utility for CookApp
const API_BASE = "http://localhost:8000";

export async function fetchIngredients(): Promise<Ingredient[]> {
  const res = await fetch(`${API_BASE}/ingredients/`);
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return res.json();
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recipes/`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

export async function fetchFridgeItems(): Promise<FridgeItem[]> {
  const res = await fetch(`${API_BASE}/fridge_items/`);
  if (!res.ok) throw new Error("Failed to fetch fridge items");
  return res.json();
}

export async function addIngredient(ingredient: Partial<Ingredient>): Promise<Ingredient> {
  const res = await fetch(`${API_BASE}/ingredients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient)
  });
  if (!res.ok) throw new Error("Failed to add ingredient");
  return res.json();
}

export async function addFridgeItem(item: Partial<FridgeItem>): Promise<FridgeItem> {
  const res = await fetch(`${API_BASE}/fridge_items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error("Failed to add item to fridge");
  return res.json();
}

export async function deleteIngredient(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/ingredients/${id}/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete ingredient");
}

export async function fetchMealTypes(): Promise<MealType[]> {
  const res = await fetch(`${API_BASE}/meal_types/`);
  if (!res.ok) throw new Error("Failed to fetch meal types");
  return res.json();
}

export async function fetchSchedule(startDate?: string, endDate?: string): Promise<Schedule[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const url = params.toString()
    ? `${API_BASE}/schedule/?${params.toString()}`
    : `${API_BASE}/schedule/`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  return res.json();
}

export async function addRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe)
  });
  if (!res.ok) throw new Error("Failed to add recipe");
  return res.json();
}

export async function updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe)
  });
  if (!res.ok) throw new Error("Failed to update recipe");
  return res.json();
}

export async function addScheduleDish(scheduleItem: Partial<Schedule>): Promise<Schedule> {
  const res = await fetch(`${API_BASE}/schedule/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scheduleItem)
  });
  if (!res.ok) throw new Error("Failed to add dish to schedule");
  return res.json();
}

export async function deleteScheduleDish(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/schedule/${id}/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete dish from schedule");
}