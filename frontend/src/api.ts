import type { Ingredient, Recipe, FridgeItem, MealType, ShoppingListItem } from "./types/apiTypes";
import type { Schedule } from "./types/Schedule.types";
// API utility for CookApp
import { API_BASE } from './config';
console.log("API_BASE:", API_BASE);

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers as Record<string,string> || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const res = await fetch(input, { ...init, headers, credentials: 'include' });
  if (res.status === 401) {
    // try refresh
    const r = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (r.ok) {
      const data = await r.json();
      setAccessToken(data.access_token);
      headers.set('Authorization', `Bearer ${data.access_token}`);
      return fetch(input, { ...init, headers, credentials: 'include' });
    }
  }
  return res;
}

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
  const res = await fetchWithAuth(`${API_BASE}/fridge_items/`);
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
  const res = await fetchWithAuth(`${API_BASE}/fridge_items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error("Failed to add item to fridge");
  return res.json();
}

export async function deleteFridgeItem(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/fridge_items/${id}/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete fridge item");
}

export async function updateFridgeItem(id: number, item: Partial<FridgeItem>): Promise<FridgeItem> {
  const res = await fetchWithAuth(`${API_BASE}/fridge_items/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error("Failed to update fridge item");
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

  const res = await fetchWithAuth(url);
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

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/recipes/${id}/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
}

export async function addScheduleDish(scheduleItem: Partial<Schedule>): Promise<Schedule> {
  const res = await fetchWithAuth(`${API_BASE}/schedule/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scheduleItem)
  });
  if (!res.ok) throw new Error("Failed to add dish to schedule");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  console.log("Login response:", data);
  setAccessToken(data.access_token);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function logout() {
  setAccessToken(null);
  // If backend provides logout endpoint to clear cookies, call it
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
}

export async function deleteScheduleDish(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/schedule/${id}/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete dish from schedule");
}

export async function fetchShoppingList(startDate?: string, endDate?: string): Promise<ShoppingListItem[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const url = params.toString()
    ? `${API_BASE}/shopping_list/?${params.toString()}`
    : `${API_BASE}/shopping_list/`;

  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error("Failed to fetch shopping list");
  return res.json();
}