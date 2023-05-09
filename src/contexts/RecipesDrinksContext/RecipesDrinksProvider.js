import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import RecipesDrinksContext from './RecipesDrinksContext';

// REQUISITO 19 -> CONSTRUINDO O CONTEXTO DAS RECEITAS
function RecipesDrinksProvider({ children }) {
  const [drinksRecipes, setDrinksRecipes] = useState([]);
  const [categoryDrinks, setCategoryDrinks] = useState([]);

  const [resetDrinks, setResetDrinks] = useState([]);

  const [drinkDetails, setDrinkDetails] = useState({});
  const [mealsRecommendations, setMealsRecommendations] = useState([]);

  const [startRecipeDrink, setStartRecipeDrink] = useState(false);

  const [inProgressRecipesDrink, setInProgressRecipesDrink] = useState(false);

  const context = useMemo(() => ({
    drinksRecipes,
    setDrinksRecipes,
    categoryDrinks,
    setCategoryDrinks,
    resetDrinks,
    setResetDrinks,
    drinkDetails,
    setDrinkDetails,
    mealsRecommendations,
    setMealsRecommendations,
    startRecipeDrink,
    setStartRecipeDrink,
    inProgressRecipesDrink,
    setInProgressRecipesDrink,
  }), [drinksRecipes, categoryDrinks, resetDrinks, drinkDetails, mealsRecommendations,
    startRecipeDrink, inProgressRecipesDrink]);

  return (
    <RecipesDrinksContext.Provider value={ context }>
      {children}
    </RecipesDrinksContext.Provider>
  );
}

RecipesDrinksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecipesDrinksProvider;
