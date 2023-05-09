import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';
import '../styles/RecipesDetails.css';

export default function RecipeDetails() {
  const { mealDetails } = useContext(RecipesMealsContext);
  const { drinkDetails } = useContext(RecipesDrinksContext);
  const {
    id: mealId,
    title: mealTitle,
    image: mealImage,
    category: mealCategory,
    ingredients: mealIngredients,
    instructions: mealInstructions,
    video: mealVideo,
  } = mealDetails;

  const {
    id: drinkId,
    title: drinkTitle,
    image: drinkImage,
    alcohol: drinkAlcohol,
    ingredients: drinkIngredients,
    instructions: drinkInstructions,
  } = drinkDetails;
  const location = useLocation();
  return (
    (mealDetails.ingredients || drinkDetails.ingredients) && (
      <>
        <img
          className="recipeDetails-img"
          data-testid="recipe-photo"
          src={ mealImage || drinkImage }
          alt={ `${mealTitle || drinkTitle}` }
        />
        <h2 data-testid="recipe-title">{mealTitle || drinkTitle}</h2>
        <p data-testid="recipe-category">{mealCategory || drinkAlcohol}</p>
        <h3>Ingredients</h3>
        <ul>
          {
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
          }
        </ul>
        <h3>Instructions</h3>
        <p data-testid="instructions">{mealInstructions || drinkInstructions}</p>
        {
          location.pathname === `/meals/${mealId}`
          && <iframe
            data-testid="video"
            title={ `Video ${mealTitle}` }
            width="420"
            height="315"
            src={ `https://www.youtube.com/embed/${mealVideo.split('=')[1]}` }
          />
        }
      </>
    )
  );
}
