import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ButtonAll from '../components/ButtonAll';
import CategoryButtons from '../components/CategoryButtons';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import RecipesContext from '../contexts/RecipesMealsContext/RecipesMealsContext';

import SearchContext from '../contexts/SearchContext/SearchContext';

const MAGIC_NUMBER_TWELVE = 12;
const MAGIC_NUMBER_FIVE = 5;

export default function Meals() {
  const { searchMealsResult } = useContext(SearchContext);
  const { mealsRecipes, setMealsRecipes,
    setCategoryMeals, categoryMeals,
    setResetMeals, resetMeals } = useContext(RecipesContext);
  const [currentCategory, setCurrentCategory] = useState('');

  const fetchInitialRecipes = useCallback(async () => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    setMealsRecipes(data.meals);
    setResetMeals(data.meals);
  }, [setMealsRecipes, setResetMeals]);

  const fetchCategorys = useCallback(async () => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    const categories = data.meals
      .map((category) => category.strCategory).slice(0, MAGIC_NUMBER_FIVE);
    setCategoryMeals(categories);
  }, [setCategoryMeals]);

  useEffect(() => {
    fetchInitialRecipes();
    fetchCategorys();
  }, [fetchCategorys, fetchInitialRecipes]);

  const fetchCategoryResult = async (category) => {
    console.log(currentCategory);
    if (currentCategory === category) {
      setMealsRecipes(resetMeals);
      return;
    }
    setCurrentCategory(category);
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    setMealsRecipes(data.meals);
  };

  return (
    <>
      <Header
        title="Meals"
        searchIcon
      />
      <ButtonAll />
      {
        categoryMeals.map((category) => (<CategoryButtons
          key={ category }
          category={ category }
          onClick={ () => fetchCategoryResult(category) }
        />))
      }

      {/* REQUISITO 14 -> RENDERIZAR AS 12 PRIMEIRAS RECEITAS DA BUSCA */}
      {searchMealsResult.length > 1 && searchMealsResult.slice(0, MAGIC_NUMBER_TWELVE)
        .map(({ idMeal, strMeal, strMealThumb }, index) => (
          <Link to={ `/meals/${idMeal}` } key={ idMeal }>
            <Recipes
              image={ strMealThumb }
              name={ strMeal }
              index={ index }
            />
          </Link>
        ))}
      {/* REQUISITO 19 -> RENDERIZAR AS 12 PRIMEIRAS RECEITAS DA BUSCA */}
      {
        mealsRecipes.length > 0
        && searchMealsResult.length === 0
        && mealsRecipes.slice(0, MAGIC_NUMBER_TWELVE)
          .map(({ idMeal, strMeal, strMealThumb }, index) => (
            <Link to={ `/meals/${idMeal}` } key={ idMeal }>
              <Recipes
                key={ idMeal }
                image={ strMealThumb }
                name={ strMeal }
                index={ index }
              />
            </Link>
          ))
      }
      <Footer />
    </>
  );
}
