import React, { useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import '../styles/Carousel.css';

const MAGIC_NUMBER_INGREDIENTS_LIST = 15;

export default function DrinksDetails() {
  const { pathname } = useLocation();
  const idDrink = pathname.split('/')[2];
  const {
    setDrinkDetails,
    mealsRecommendations,
    setMealsRecommendations,
  } = useContext(RecipesDrinksContext);
  const fetchDrinkDetails = useCallback(async () => {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
    const data = await response.json();
    console.log(data.drinks);
    const recipeDetails = {
      id: '',
      image: '',
      title: '',
      alcohol: '',
      ingredients: [],
      instructions: '',
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
    });
    setDrinkDetails(recipeDetails);
  }, [idDrink, setDrinkDetails]);

  const fetchMealsRecommendations = useCallback(async () => {
    const MAX_RECOMMENDED_NUMBER = 6;
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recommended = data.meals.slice(0, MAX_RECOMMENDED_NUMBER);
    setMealsRecommendations(recommended);
  }, [setMealsRecommendations]);

  useEffect(() => {
    fetchDrinkDetails();
    fetchMealsRecommendations();
  }, [fetchDrinkDetails, fetchMealsRecommendations]);

  return (
    <>
      <RecipeDetails />
      <div className="carousel">
        {mealsRecommendations?.map((item, index) => (
          <div
            key={ item.strMeal }
            data-testid={ `${index}-recommendation-card` }
          >
            <h3
              data-testid={ `${index}-recommendation-title` }
            >
              {item.strMeal}

            </h3>
            <img
              className="carousel-img"
              src={ item.strMealThumb }
              alt={ item.strMeal }
            />
          </div>
        ))}
      </div>
    </>
  );
}
