import React, { } from 'react';

export default function RecipeInProgress() {
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
        <li>Ingredientes</li>

      </ul>
      <h3>Instructions</h3>
      <p data-testid="instructions">Instruções</p>
      <button data-testid="finish-recipe-btn">Finnish Recipe</button>
    </>
  );
}

// const ingredientesRecipes = mealDetails.ingredients;
// setStartRecipeMeal(true);
// const ProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
// ProgressRecipes.meals = { [idMeals]: ingredientesRecipes };
// localStorage.setItem('inProgressRecipes', JSON.stringify(ProgressRecipes));

// const continueRecipe = useCallback(() => {
//   const isInProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
//   if (isInProgressRecipes.meals
//     && Object.keys(isInProgressRecipes.meals)[0] === idMeals) {
//     console.log();
//     setInProgressRecipesMeal(true);
//     setStartRecipeMeal(true);
//   } else {
//     setInProgressRecipesMeal(false);
//     setStartRecipeMeal(false);
//   }
// }, [setInProgressRecipesMeal, idMeals, setStartRecipeMeal]);
