// API utility for CookApp
const API_BASE = "http://localhost:8000";

export async function fetchIngredients() {
  const res = await fetch(`${API_BASE}/ingredients/`);
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return res.json();
}

export async function fetchRecipes() {
  const res = await fetch(`${API_BASE}/recipes/`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function fetchFridgeItems() {
  const res = await fetch(`${API_BASE}/fridge_items/`);
  if (!res.ok) throw new Error("Failed to fetch fridge items");
  return res.json();
}

export async function addIngredient(ingredient: any) {
  const res = await fetch(`${API_BASE}/ingredients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient)
  });
  if (!res.ok) throw new Error("Failed to add ingredient");
  return res.json();
}

export async function addFridgeItem(item: any) {
  const res = await fetch(`${API_BASE}/fridge_items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error("Failed to add item to fridge");
  return res.json();
}

export async function deleteIngredient(id: number) {
  const res = await fetch(`${API_BASE}/ingredients/${id}/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete ingredient");
}
