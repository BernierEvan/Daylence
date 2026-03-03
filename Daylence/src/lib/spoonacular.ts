// src/lib/spoonacular.ts
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

export async function searchRecipes(query: string) {
  const url = `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=10&apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur Spoonacular');
  return res.json();
}

export async function getRandomRecipes(number = 20) {
  const url = `${BASE_URL}/recipes/random?number=${number}&apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur Spoonacular (random)");
  return res.json();
}

export async function getRecipeDetails(id: number) {
  const url = `${BASE_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur Spoonacular');
  return res.json();
}
