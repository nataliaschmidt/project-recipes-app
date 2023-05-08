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
  }), [drinksRecipes, categoryDrinks, resetDrinks, drinkDetails, mealsRecommendations]);

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
