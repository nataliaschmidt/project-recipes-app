import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import RecipesMealsContext from './RecipesMealsContext';
// REQUISITO 19 -> CONSTRUINDO O CONTEXTO DAS RECEITAS
function RecipesMealsProvider({ children }) {
  const [mealsRecipes, setMealsRecipes] = useState([]);
  const [categoryMeals, setCategoryMeals] = useState([]);

  const [resetMeals, setResetMeals] = useState([]);

  const [mealDetails, setMealDetails] = useState({});
  const [drinksRecommendations, setDrinksRecommendations] = useState([]);
  const [startRecipeMeal, setStartRecipeMeal] = useState(false);

  const [inProgressRecipesMeal, setInProgressRecipesMeal] = useState(false);

  const context = useMemo(() => ({
    mealsRecipes,
    setMealsRecipes,
    categoryMeals,
    setCategoryMeals,
    resetMeals,
    setResetMeals,
    mealDetails,
    setMealDetails,
    drinksRecommendations,
    setDrinksRecommendations,
    startRecipeMeal,
    setStartRecipeMeal,
    inProgressRecipesMeal,
    setInProgressRecipesMeal,
  }), [mealsRecipes, categoryMeals, resetMeals, mealDetails, drinksRecommendations,
    startRecipeMeal, inProgressRecipesMeal]);
  return (
    <RecipesMealsContext.Provider value={ context }>
      {children}
    </RecipesMealsContext.Provider>
  );
}

RecipesMealsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecipesMealsProvider;
