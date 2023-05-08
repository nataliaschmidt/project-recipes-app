import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ButtonAll from '../components/ButtonAll';
import CategoryButtons from '../components/CategoryButtons';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import SearchContext from '../contexts/SearchContext/SearchContext';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';

const MAGIC_NUMBER_TWELVE = 12;
const MAGIC_NUMBER_FIVE = 5;

export default function Drinks() {
  const { searchDrinksResult } = useContext(SearchContext);
  const { drinksRecipes, setDrinksRecipes,
    categoryDrinks,
    setCategoryDrinks, setResetDrinks, resetDrinks } = useContext(RecipesDrinksContext);
  const { setMealDetails } = useContext(RecipesMealsContext);
  const [currentCategory, setCurrentCategory] = useState('');

  const fetchInitialRecipes = useCallback(async () => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    setDrinksRecipes(data.drinks);
    setResetDrinks(data.drinks);
  }, [setDrinksRecipes, setResetDrinks]);

  const fetchCategorys = useCallback(async () => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    const categories = data.drinks
      .map((category) => category.strCategory).slice(0, MAGIC_NUMBER_FIVE);
    setCategoryDrinks(categories);
  }, [setCategoryDrinks]);

  useEffect(() => {
    fetchInitialRecipes();
    fetchCategorys();
  }, [fetchInitialRecipes, fetchCategorys]);

  const fetchCategoryResult = async (category) => {
    console.log(currentCategory);
    if (currentCategory === category) {
      setDrinksRecipes(resetDrinks);
      return;
    }
    setCurrentCategory(category);
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    setDrinksRecipes(data.drinks);
  };

  return (
    <>
      <Header
        title="Drinks"
        searchIcon
      />
      <ButtonAll />
      {
        categoryDrinks.map((category) => (<CategoryButtons
          key={ category }
          category={ category }
          onClick={ () => fetchCategoryResult(category) }
        />))
      }
      {/* REQUISITO 14 -> RENDERIZAR AS 12 PRIMEIRAS RECEITAS DA BUSCA */}

      { searchDrinksResult.length > 1 && searchDrinksResult.slice(0, MAGIC_NUMBER_TWELVE)
        .map(({ idDrink, strDrink, strDrinkThumb }, index) => (
          <Link
            to={ `/drinks/${idDrink}` }
            key={ idDrink }
            onClick={ () => setMealDetails({}) }
          >
            <Recipes
              key={ idDrink }
              image={ strDrinkThumb }
              name={ strDrink }
              index={ index }
            />
          </Link>
        ))}
      {
        drinksRecipes.length > 0
        && searchDrinksResult.length === 0
        && drinksRecipes.slice(0, MAGIC_NUMBER_TWELVE)
          .map(({ idDrink, strDrink, strDrinkThumb }, index) => (
            <Link
              to={ `/drinks/${idDrink}` }
              key={ idDrink }
              onClick={ () => setMealDetails({}) }
            >
              <Recipes
                key={ idDrink }
                image={ strDrinkThumb }
                name={ strDrink }
                index={ index }

              />
            </Link>
          ))
      }
      <Footer />
    </>
  );
}
