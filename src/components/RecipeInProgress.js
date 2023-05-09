import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RecipeInProgress() {
  const [recipeInProgress, setRecipeInProgress] = useState();
  const location = useLocation();
  console.log(recipeInProgress);
  useEffect(() => {
    const recipesInProgressLocalStorage = JSON
      .parse(localStorage.getItem('inProgressRecipes'));
    if (location.pathname.includes('meals')) {
      const newRecipeInProgress = recipesInProgressLocalStorage.meals;
      setRecipeInProgress(newRecipeInProgress);
    } else {
      const newRecipeInProgress = recipesInProgressLocalStorage.drinks;
      setRecipeInProgress(newRecipeInProgress);
    }
  }, [location]);

  return (
    <>
      <button
        data-testid="share-btn"
      >
        Compartilhar
      </button>
      {/* <span>{linkCopy}</span> */}

      <button
        data-testid="favorite-btn"
      >
        Favoritar
      </button>

      <img
        className="recipeDetails-img"
        data-testid="recipe-photo"
        src=""
        alt=""
      />

      <h2 data-testid="recipe-title">Titulo</h2>
      <p data-testid="recipe-category">Categoria</p>
      <h3>Ingredients</h3>
      <ul>
        <li>Lista de ingredientes</li>
        {/* {
          location.pathname === `/meals/${mealId}`
        && (mealIngredients.map((e, index) => (
          <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
            {`${e.ingredient} - ${e.measure}`}
          </li>
        )))
        }
        {
          location.pathname === `/drinks/${drinkId}`
        && (drinkIngredients.map((e, index) => (
          <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
            {e.measure}
            {' '}
            -
            {' '}
            {e.ingredient}
          </li>
        )))
        } */}
      </ul>
      <h3>Instructions</h3>
      <p data-testid="instructions">Instruções</p>
      <button data-testid="finish-recipe-btn">Finnish Recipe</button>
    </>
  );
}
