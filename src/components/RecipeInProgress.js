/* eslint-disable max-lines */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../styles/RecipeInProgress.css';
import ButtonsFavoriteAndShare from './ButtonsFavoriteAndShare';
import HomeButton from './HomeButton';
import Loading from './Loading';

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipeInProgressMeals = useCallback(async () => {
    setIsLoading(true);
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

    data?.meals?.forEach((meal) => {
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
      recipeDetails.tags = meal?.strTags?.split(',');
    });
    setRecipeInProgress(recipeDetails);
    setIsLoading(false);
  }, [id]);

  const fetchRecipeInProgressDrinks = useCallback(async () => {
    setIsLoading(true);
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
    data?.drinks?.forEach((drink) => {
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
    setIsLoading(false);
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
      const newCheckedList = checkedList?.filter((item) => item !== value);
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
    if (location.pathname.includes('meals')) {
      fetchRecipeInProgressMeals();
    } else {
      fetchRecipeInProgressDrinks();
    }
  }, [fetchRecipeInProgressMeals, fetchRecipeInProgressDrinks, location.pathname]);

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
  }, [id, location.pathname, saveStatusRecipe, checkDisabled]);
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
    <div>
      {isLoading ? <Loading />
        : (
          <>
            <div className="container-recipe-details-img">
              <img
                className="recipe-details-img"
                data-testid="recipe-photo"
                src={ recipeInProgress.image }
                alt={ recipeInProgress.title }
              />
              <HomeButton />
              <ButtonsFavoriteAndShare
                recipeInProgress={ recipeInProgress }
              />
            </div>

            <div className="container-info-recipes">
              <h1 data-testid="recipe-title">{recipeInProgress.title}</h1>

              {location.pathname.includes('drinks')
                ? <h4>{recipeInProgress.alcohol}</h4>
                : <h4 data-testid="recipe-category">{recipeInProgress.category}</h4>}
              <h2>Ingredients</h2>
              <div className="container-list">
                <ul>
                  {
                    recipeInProgress?.ingredients?.map(({
                      ingredient, measure,
                    }, index) => (
                      <li key={ index }>

                        <label
                          data-testid={ `${index}-ingredient-step` }
                          className={ checkedList.includes(ingredient)
                            ? 'underline-checked label-checkbox'
                            : 'label-checkbox' }
                        >
                          <input
                            className="input-in-progress"
                            type="checkbox"
                            value={ ingredient }
                            name={ ingredient }
                            checked={ checkedList.includes(ingredient) }
                            onChange={ ({ target }) => handleChangeCheckbox(target) }
                          />
                          <span className="custom-checkbox" />
                          {`${measure} - ${ingredient}`}
                        </label>

                      </li>
                    ))
                  }
                </ul>
              </div>
              <h2>Instructions</h2>
              <p
                data-testid="instructions"
                className="intructions-progress"
              >
                {recipeInProgress.instructions}

              </p>
            </div>
            <button
              data-testid="finish-recipe-btn"
              disabled={ isDisabled }
              onClick={ handleClickFinishRecipe }
              className="btn-start-recipe finish-recipe"
            >
              Finnish Recipe
            </button>
          </>
        )}
    </div>
  );
}
