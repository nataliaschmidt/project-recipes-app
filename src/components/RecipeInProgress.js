import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RecipeInProgress() {
  const [ingredientsRecipeInProgress, setIngredientsRecipeInProgress] = useState();
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  console.log(id);
  console.log(ingredientsRecipeInProgress);
  useEffect(() => {
    const ingredientsRecipesInProgressLocalStorage = JSON
      .parse(localStorage.getItem('inProgressRecipes'));
    if (location.pathname.includes('meals')) {
      const newIngredientsRecipeInProgress = ingredientsRecipesInProgressLocalStorage
        .meals[id];
      setIngredientsRecipeInProgress(newIngredientsRecipeInProgress);
    } else {
      const newIngredientsRecipeInProgress = ingredientsRecipesInProgressLocalStorage
        .drinks[id];
      setIngredientsRecipeInProgress(newIngredientsRecipeInProgress);
    }
  }, [location, id]);

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
        {
          ingredientsRecipeInProgress?.map(({ ingredient, measure }, index) => (
            <li key={ index }>
              <label
                data-testid={ `${index}-ingredient-step` }
                htmlFor={ ingredient }
              >
                <input type="checkbox" />
                {`${measure} - ${ingredient}`}
              </label>
            </li>

          ))
        }

      </ul>
      <h3>Instructions</h3>
      <p data-testid="instructions">Instruções</p>
      <button data-testid="finish-recipe-btn">Finnish Recipe</button>
    </>
  );
}
