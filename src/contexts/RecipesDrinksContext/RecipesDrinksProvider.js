import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import RecipesDrinksContext from './RecipesDrinksContext';

// REQUISITO 19 -> CONSTRUINDO O CONTEXTO DAS RECEITAS
function RecipesDrinksProvider({ children }) {
  const [drinksRecipes, setDrinksRecipes] = useState([]);
  const [categoryDrinks, setCategoryDrinks] = useState([]);

  const [resetDrinks, setResetDrinks] = useState([]);

  const [drinkDetails, setDrinkDetails] = useState({});

  const context = useMemo(() => ({
    drinksRecipes,
    setDrinksRecipes,
    categoryDrinks,
    setCategoryDrinks,
    resetDrinks,
    setResetDrinks,
    drinkDetails,
    setDrinkDetails,
  }), [drinksRecipes, categoryDrinks, resetDrinks, drinkDetails]);

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
