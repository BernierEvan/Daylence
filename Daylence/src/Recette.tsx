import { useEffect, useState } from 'react';

import { getRandomRecipes } from './lib/spoonacular';
import { translateTextsToFrench } from './lib/translate';
import './Recette.css';

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

type SpoonacularRecipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  extendedIngredients?: Ingredient[];
};

function Recette() {
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRandomRecipes = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getRandomRecipes(6);
      const randomRecipes = (data.recipes ?? []) as SpoonacularRecipe[];

      try {
        const translatedTitles = await translateTextsToFrench(
          randomRecipes.map((recipe) => recipe.title),
        );

        const translatedRecipes = randomRecipes.map((recipe, index) => ({
          ...recipe,
          title: translatedTitles[index] ?? recipe.title,
        }));

        setRecipes(translatedRecipes);
      } catch {
        setRecipes(randomRecipes);
      }
    } catch {
      setError('Erreur pendant le chargement des recettes random.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRandomRecipes();
  }, []);

  return (
    <main className="recipes-page">
      <div className="recipes-header">
        <h1 className="recipes-title">Recettes random</h1>

        <button
          type="button"
          className="recipes-refresh-btn"
          onClick={loadRandomRecipes}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Nouvelles recettes'}
        </button>
      </div>

      {error && <p className="recipes-error">{error}</p>}

      <ul className="recipes-grid">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-card">
            <img className="recipe-image" src={recipe.image} alt={recipe.title} />
            <div className="recipe-content">
              <h2 className="recipe-name">{recipe.title}</h2>
              <p className="recipe-ingredients">
                {(recipe.extendedIngredients ?? [])
                  .slice(0, 5)
                  .map((ingredient) => ingredient.name)
                  .join(', ')}
              </p>
            </div>
            <div className="recipe-meta">
              <span className="recipe-chip">
                {recipe.readyInMinutes} min
              </span>
              <span className="recipe-chip">
                {recipe.servings} pers
              </span>
              <span className="recipe-chip">
                Score {recipe.healthScore}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Recette;
