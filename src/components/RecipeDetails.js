import React, { useContext, useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { useLocation } from 'react-router-dom';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';
import '../styles/RecipesDetails.css';

export default function RecipeDetails() {
  const { mealDetails } = useContext(RecipesMealsContext);
  const { drinkDetails } = useContext(RecipesDrinksContext);
  const [linkCopy, setLinkCopy] = useState('');
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

  const handleClickCopy = async () => {
    await copy(window.location.href);
    setLinkCopy('Link copied!');
  };

  useEffect(() => {
    setLinkCopy('');
  }, []);

  const handleClickFavorite = () => {
    console.log(drinkDetails);
    if (!JSON.parse(localStorage.getItem('favoriteRecipes'))) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    }
    let newFavorite = {};
    if (location.pathname.includes('meals')) {
      newFavorite = {
        id: mealDetails.id,
        type: mealDetails.type,
        nationality: mealDetails.nationality,
        category: mealDetails.category,
        alcoholicOrNot: '',
        name: mealDetails.title,
        image: mealDetails.image,
      };
    }
    if (location.pathname.includes('drinks')) {
      newFavorite = {
        id: drinkDetails.id,
        type: drinkDetails.type,
        nationality: '',
        category: drinkDetails.category,
        alcoholicOrNot: drinkDetails.alcohol,
        name: drinkDetails.title,
        image: drinkDetails.image,
      };
    }
    const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const verifyFavoriteRecipe = favoriteLocalStorage
      .some((recipe) => recipe.id === newFavorite.id);
    if (!verifyFavoriteRecipe) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([...favoriteLocalStorage, newFavorite]));
    }
  };

  return (
    (mealDetails.ingredients || drinkDetails.ingredients) && (
      <>
        <button
          data-testid="share-btn"
          onClick={ handleClickCopy }
        >
          Compartilhar

        </button>
        <span>{linkCopy}</span>

        <button
          data-testid="favorite-btn"
          onClick={ handleClickFavorite }
        >
          Favoritar

        </button>

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
