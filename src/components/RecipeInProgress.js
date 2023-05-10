import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../styles/RecipeInProgress.css';
import ButtonsFavoriteAndShare from './ButtonsFavoriteAndShare';

export default function RecipeInProgress() {
  const location = useLocation();
  const history = useHistory();
  const id = location.pathname.split('/')[2];
  const getInitialState = () => {
    if (JSON.parse(localStorage.getItem('inProgressRecipes'))) {
      const progressRecipesLocalStorage = JSON
        .parse(localStorage.getItem('inProgressRecipes'));
      let checkedListInitial = [];
      if (location.pathname.includes('drinks')) {
        checkedListInitial = progressRecipesLocalStorage
          .drinks[id] || [];
      }
      if (location.pathname.includes('meals')) {
        checkedListInitial = progressRecipesLocalStorage
          .meals[id] || [];
      }
      return checkedListInitial;
    }
    return [];
  };
  const [isDisabled, setIsDisabled] = useState(true);
  const [checkedList, setCheckedList] = useState(getInitialState());
  const [recipeInProgress, setRecipeInProgress] = useState({});
  console.log(recipeInProgress);
  const fetchRecipeInProgressMeals = useCallback(async () => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const MAGIC_NUMBER_INGREDIENTS_LIST = 20;
    const recipeDetails = {
      id: '',
      image: '',
      title: '',
      category: '',
      ingredients: [],
      instructions: '',
      video: '',
      type: 'meal',
      nationality: '',
      tags: [],
    };

    data.meals.forEach((meal) => {
      recipeDetails.id = meal.idMeal;
      recipeDetails.image = meal.strMealThumb;
      recipeDetails.title = meal.strMeal;
      recipeDetails.category = meal.strCategory;
      for (let index = 1; index <= MAGIC_NUMBER_INGREDIENTS_LIST; index += 1) {
        if (meal[`strIngredient${index}`]) {
          recipeDetails.ingredients.push({
            ingredient: meal[`strIngredient${index}`],
            measure: meal[`strMeasure${index}`],
          });
        }
      }
      recipeDetails.instructions = meal.strInstructions;
      recipeDetails.video = meal.strYoutube;
      recipeDetails.nationality = meal.strArea;
      recipeDetails.tags = meal.strTags.split(',');
    });
    setRecipeInProgress(recipeDetails);
  }, [id]);
  const fetchRecipeInProgressDrinks = useCallback(async () => {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const MAGIC_NUMBER_INGREDIENTS_LIST = 15;
    const recipeDetails = {
      id: '',
      image: '',
      title: '',
      alcohol: '',
      ingredients: [],
      instructions: '',
      type: 'drink',
      nationality: '',
      category: '',
      tags: [],
    };
    data.drinks.forEach((drink) => {
      recipeDetails.id = drink.idDrink;
      recipeDetails.image = drink.strDrinkThumb;
      recipeDetails.title = drink.strDrink;
      recipeDetails.alcohol = drink.strAlcoholic;

      for (let index = 1; index <= MAGIC_NUMBER_INGREDIENTS_LIST; index += 1) {
        if (drink[`strIngredient${index}`]) {
          recipeDetails.ingredients.push({
            ingredient: drink[`strIngredient${index}`],
            measure: drink[`strMeasure${index}`],
          });
        }
      }
      recipeDetails.instructions = drink.strInstructions;
      recipeDetails.category = drink.strCategory;
    });
    setRecipeInProgress(recipeDetails);
  }, [id]);
  const saveStatusRecipe = useCallback(() => {
    let updateProgress = [];
    if (location.pathname.includes('meals')) {
      const progressRecipesLocalStorage = JSON
        .parse(localStorage.getItem('inProgressRecipes'));
      updateProgress = {
        ...progressRecipesLocalStorage,
        meals: {
          ...progressRecipesLocalStorage.meals,
          [id]: checkedList,
        },
      };
    }
    if (location.pathname.includes('drinks')) {
      const progressRecipesLocalStorage = JSON
        .parse(localStorage.getItem('inProgressRecipes'));
      updateProgress = {
        ...progressRecipesLocalStorage,
        drinks: {
          ...progressRecipesLocalStorage.drinks,
          [id]: checkedList,
        },
      };
    }
    localStorage.setItem('inProgressRecipes', JSON.stringify(updateProgress));
  }, [checkedList, location.pathname, id]);
  const handleChangeCheckbox = (target) => {
    const { value } = target;
    if (!checkedList.includes(value)) {
      setCheckedList((prevState) => [...prevState, value]);
    }
    if (checkedList.includes(value)) {
      const newCheckedList = checkedList.filter((item) => item !== value);
      setCheckedList(newCheckedList);
    }
  };
  const checkDisabled = useCallback(() => {
    if (recipeInProgress) {
      if (checkedList.length === recipeInProgress?.ingredients?.length) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [checkedList.length, recipeInProgress?.ingredients?.length]);
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('inProgressRecipes'))) {
      localStorage.setItem('inProgressRecipes', JSON.stringify({
        meals: {},
        drinks: {},
      }));
    }
    if (!JSON.parse(localStorage.getItem('doneRecipes'))) {
      localStorage.setItem('doneRecipes', JSON.stringify([]));
    }
    saveStatusRecipe();
    checkDisabled();
    if (location.pathname.includes('meals')) {
      fetchRecipeInProgressMeals();
    } else {
      fetchRecipeInProgressDrinks();
    }
  }, [fetchRecipeInProgressMeals, id,
    fetchRecipeInProgressDrinks, location.pathname, saveStatusRecipe, checkDisabled]);
  const handleClickFinishRecipe = () => {
    let doneRecipe = {};
    if (location.pathname.includes('meals')) {
      doneRecipe = {
        id: recipeInProgress.id,
        type: recipeInProgress.type,
        nationality: recipeInProgress.nationality,
        category: recipeInProgress.category,
        alcoholicOrNot: '',
        name: recipeInProgress.title,
        image: recipeInProgress.image,
        doneDate: new Date(),
        tags: recipeInProgress.tags,
      };
    }
    if (location.pathname.includes('drinks')) {
      doneRecipe = {
        id: recipeInProgress.id,
        type: recipeInProgress.type,
        nationality: '',
        category: recipeInProgress.category,
        alcoholicOrNot: recipeInProgress.alcohol,
        name: recipeInProgress.title,
        image: recipeInProgress.image,
        doneDate: new Date(),
        tags: recipeInProgress.tags,
      };
    }
    const doneRecipesLocalStorage = JSON.parse(localStorage.getItem('doneRecipes'));
    localStorage.setItem('doneRecipes', JSON
      .stringify([...doneRecipesLocalStorage, doneRecipe]));
    history.push('/done-recipes');
  };
  return (
    <>
      <ButtonsFavoriteAndShare
        recipeInProgress={ recipeInProgress }
      />
      <img
        className="recipeDetails-img"
        data-testid="recipe-photo"
        src={ recipeInProgress.image }
        alt={ recipeInProgress.title }
      />
      <h2 data-testid="recipe-title">{recipeInProgress.title}</h2>
      <p data-testid="recipe-category">{recipeInProgress.category}</p>
      {location.pathname.includes('drinks') && <p>{recipeInProgress.alcohol}</p>}
      <h3>Ingredients</h3>
      <ul>
        {
          recipeInProgress.ingredients?.map(({ ingredient, measure }, index) => (
            <li key={ index }>
              <label
                data-testid={ `${index}-ingredient-step` }
                className={ checkedList.includes(ingredient)
                  ? 'underline-checked'
                  : '' }
              >
                <input
                  type="checkbox"
                  value={ ingredient }
                  name={ ingredient }
                  checked={ checkedList.includes(ingredient) }
                  onChange={ ({ target }) => handleChangeCheckbox(target) }
                />
                {`${measure} - ${ingredient}`}
              </label>
            </li>
          ))
        }
      </ul>
      <h3>Instructions</h3>
      <p data-testid="instructions">{recipeInProgress.instructions}</p>
      <button
        data-testid="finish-recipe-btn"
        disabled={ isDisabled }
        onClick={ handleClickFinishRecipe }
      >
        Finnish Recipe
      </button>
    </>
  );
}
