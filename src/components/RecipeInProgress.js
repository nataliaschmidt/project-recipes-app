import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/RecipeInProgress.css';

export default function RecipeInProgress() {
  const [isChecked, setIsChecked] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [recipeInProgress, setRecipeInProgress] = useState({});
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  console.log(checkedList);

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

  const handleChangeCheckbox = (target) => {
    console.log(target);
    const { value } = target;
    if (!checkedList.includes(value)) {
      setCheckedList((prevState) => [...prevState, value]);
    }
    if (checkedList.includes(value)) {
      const newCheckedList = checkedList.filter((item) => item !== value);
      setCheckedList(newCheckedList);
    }
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('inProgressRecipes'))) {
      localStorage.setItem('inProgressRecipes', JSON.stringify({}));
    }
    if (location.pathname.includes('meals')) {
      fetchRecipeInProgressMeals();
    } else {
      fetchRecipeInProgressDrinks();
    }
  }, [fetchRecipeInProgressMeals, fetchRecipeInProgressDrinks, location.pathname]);

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
