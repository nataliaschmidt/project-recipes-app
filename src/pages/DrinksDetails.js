import React, { useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';

const MAGIC_NUMBER_INGREDIENTS_LIST = 15;

export default function DrinksDetails() {
  const { pathname } = useLocation();
  const idDrink = pathname.split('/')[2];
  const { drinkDetails, setDrinkDetails } = useContext(RecipesDrinksContext);
  console.log(drinkDetails);
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

  useEffect(() => {
    fetchDrinkDetails();
  }, [fetchDrinkDetails]);

  return (
    <RecipeDetails />
  );
}
