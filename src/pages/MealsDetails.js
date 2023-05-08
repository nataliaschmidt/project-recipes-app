import React, { useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';

const MAGIC_NUMBER_INGREDIENTS_LIST = 20;

export default function MealsDetails() {
  const { pathname } = useLocation();
  const idMeals = pathname.split('/')[2];
  const { mealDetails, setMealDetails } = useContext(RecipesMealsContext);

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
    });
    console.log(data.meals);
    setMealDetails(recipeDetails);
  }, [idMeals, setMealDetails]);

  useEffect(() => {
    fetchMealDetails();
  }, [fetchMealDetails]);

  return (
    <RecipeDetails
      details={ mealDetails }
    />
  );
}
