import React, { useContext, useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { useLocation } from 'react-router-dom';
import { IoHeartOutline, IoHeartSharp, IoShareSocialOutline } from 'react-icons/io5';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';
import '../styles/RecipeDetails.css';
import HomeButton from './HomeButton';

export default function RecipeDetails() {
  const { mealDetails } = useContext(RecipesMealsContext);
  const { drinkDetails } = useContext(RecipesDrinksContext);
  const location = useLocation();
  const currentId = location.pathname.split('/')[2];
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleClickCopy = async () => {
    const magicNumberTimeLink = 1000;
    await copy(window.location.href);
    setLinkCopy('Link copied!');
    setTimeout(() => {
      setLinkCopy(false);
    }, magicNumberTimeLink);
  };

  useEffect(() => {
    setLinkCopy('');
    if (!JSON.parse(localStorage.getItem('favoriteRecipes'))) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    }
    const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const verifyFavoriteRecipe = favoriteLocalStorage?.some(
      (recipe) => recipe.id === currentId,
    );
    if (verifyFavoriteRecipe) {
      setIsFavorite(true);
    }
  }, [currentId]);

  const handleClickFavorite = () => {
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
    const verifyFavoriteRecipe = favoriteLocalStorage?.some(
      (recipe) => recipe.id === newFavorite.id,
    );
    if (!verifyFavoriteRecipe) {
      localStorage.setItem('favoriteRecipes', JSON
        .stringify([...favoriteLocalStorage, newFavorite]));
      setIsFavorite(true);
    } else {
      const removeFavorite = favoriteLocalStorage
        .filter((recipe) => recipe.id !== newFavorite.id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(removeFavorite));
      setIsFavorite(false);
    }
  };

  return (
    (mealDetails.ingredients || drinkDetails.ingredients) && (
      <>
        <div className="container-recipe-details-img">
          <img
            className="recipe-details-img"
            data-testid="recipe-photo"
            src={ mealImage || drinkImage }
            alt={ `${mealTitle || drinkTitle}` }
          />
          <HomeButton />
          <button
            className="button-favorite neumorphism"
            onClick={ handleClickFavorite }
            data-testid="favorite-btn"
          >

            {
              isFavorite ? <IoHeartSharp className="heart-favorite-icon" />
                : (
                  <IoHeartOutline
                    className="heart-unfavorite-icon"
                  />
                )
            }

          </button>
          <button
            className="button-share neumorphism"
            data-testid="share-btn"
            onClick={ handleClickCopy }
          >
            <IoShareSocialOutline className="share-icon" />

          </button>
          <span className="link-copied">{linkCopy}</span>
        </div>

        <div className="container-info-recipes">

          <h1 data-testid="recipe-title">{mealTitle || drinkTitle}</h1>
          <h4 data-testid="recipe-category">{mealCategory || drinkAlcohol}</h4>
          <br />
          <h2>Ingredients</h2>
          <div className="container-list">

            <ul>
              {
                location.pathname === `/meals/${mealId}`
            && (mealIngredients?.map((e, index) => (
              <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                {`${e.ingredient} - ${e.measure}`}
              </li>
            )))
              }
              {
                location.pathname === `/drinks/${drinkId}`
            && (drinkIngredients?.map((e, index) => (
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
          </div>
          <h2>Instructions</h2>
          <p
            className="container-list"
            data-testid="instructions"
          >
            {mealInstructions || drinkInstructions}
          </p>
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
        </div>
      </>
    )
  );
}
