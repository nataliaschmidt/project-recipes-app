import React, { useCallback, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';
import '../styles/Carousel.css';

const MAGIC_NUMBER_INGREDIENTS_LIST = 20;

export default function MealsDetails() {
  const history = useHistory();
  const { pathname } = useLocation();
  const idMeals = pathname.split('/')[2];
  const {
    setMealDetails,
    drinksRecommendations,
    setDrinksRecommendations,
    startRecipeMeal,
    setStartRecipeMeal,
    mealDetails,
    setInProgressRecipesMeal,
  } = useContext(RecipesMealsContext);

  const fetchMealDetails = useCallback(async () => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeals}`);
    const data = await response.json();
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
    setMealDetails(recipeDetails);
  }, [idMeals, setMealDetails]);

  const fetchDrinksRecommendations = useCallback(async () => {
    const MAX_RECOMMENDED_NUMBER = 6;
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recommended = data.drinks.slice(0, MAX_RECOMMENDED_NUMBER);
    setDrinksRecommendations(recommended);
  }, [setDrinksRecommendations]);

  const startRecipe = () => {
    const ingredientesRecipes = mealDetails.ingredients;
    setStartRecipeMeal(true);
    const ProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
    ProgressRecipes.meals = { [idMeals]: ingredientesRecipes };
    localStorage.setItem('inProgressRecipes', JSON.stringify(ProgressRecipes));
    history.push(`/meals/${idMeals}/in-progress`);
  };

  const continueRecipe = useCallback(() => {
    const isInProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (isInProgressRecipes.meals
      && Object.keys(isInProgressRecipes.meals)[0] === idMeals) {
      console.log();
      setInProgressRecipesMeal(true);
      setStartRecipeMeal(true);
    } else {
      setInProgressRecipesMeal(false);
      setStartRecipeMeal(false);
    }
  }, [setInProgressRecipesMeal, idMeals, setStartRecipeMeal]);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('inProgressRecipes'))) {
      localStorage.setItem('inProgressRecipes', JSON.stringify({}));
    }
    fetchMealDetails();
    fetchDrinksRecommendations();
    continueRecipe();
  }, [fetchMealDetails, fetchDrinksRecommendations, continueRecipe]);

  return (
    <>
      <RecipeDetails />

      <div className="carousel">
        {drinksRecommendations?.map((item, index) => (
          <div
            key={ item.strDrink }
            data-testid={ `${index}-recommendation-card` }
          >
            <h3
              data-testid={ `${index}-recommendation-title` }
            >
              {item.strDrink}

            </h3>
            <img
              className="carousel-img"
              src={ item.strDrinkThumb }
              alt={ item.strDrink }
            />
          </div>
        ))}
      </div>
      <button
        data-testid="start-recipe-btn"
        style={ { position: 'fixed', bottom: 0 } }
        onClick={ startRecipe }
      >
        {!startRecipeMeal ? 'Start Recipe' : 'Continue Recipe'}
      </button>
    </>

  );
}
