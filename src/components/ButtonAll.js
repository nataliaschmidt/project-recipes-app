import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';

export default function ButtonAll() {
  const location = useLocation();
  const { setMealsRecipes, resetMeals } = useContext(RecipesMealsContext);
  const { setDrinksRecipes, resetDrinks } = useContext(RecipesDrinksContext);

  const resetRecipes = () => {
    if (location.pathname === '/meals') {
      setMealsRecipes(resetMeals);
    }
    if (location.pathname === '/drinks') {
      setDrinksRecipes(resetDrinks);
    }
  };

  return (
    <button
      data-testid="All-category-filter"
      onClick={ resetRecipes }
    >
      All
    </button>
  );
}
