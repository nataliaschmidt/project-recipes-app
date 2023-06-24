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
import '../styles/Recipe.css';
import Loading from '../components/Loading';

const MAGIC_NUMBER_TWELVE = 12;
const MAGIC_NUMBER_FIVE = 5;

export default function Drinks() {
  const { searchDrinksResult, isLoadingSearch,
    setSearchDrinksResult } = useContext(SearchContext);
  const { drinksRecipes, setDrinksRecipes,
    categoryDrinks,
    setCategoryDrinks, setResetDrinks, resetDrinks } = useContext(RecipesDrinksContext);
  const { setMealDetails } = useContext(RecipesMealsContext);
  const [currentCategory, setCurrentCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInitialRecipes = useCallback(async () => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    setDrinksRecipes(data.drinks);
    setResetDrinks(data.drinks);
    setSearchDrinksResult([]);
    setIsLoading(false);
  }, [setDrinksRecipes, setResetDrinks]);

  const fetchCategorys = useCallback(async () => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    const categories = data?.drinks?.map((category) => category.strCategory)
      .slice(0, MAGIC_NUMBER_FIVE);
    setCategoryDrinks(categories);
  }, [setCategoryDrinks]);

  useEffect(() => {
    fetchInitialRecipes();
    fetchCategorys();
  }, [fetchInitialRecipes, fetchCategorys]);

  const fetchCategoryResult = async (category) => {
    setIsLoading(true);
    if (currentCategory === category) {
      setDrinksRecipes(resetDrinks);
      setCurrentCategory('');
      setIsLoading(false);
      return;
    }
    setCurrentCategory(category);
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    setDrinksRecipes(data.drinks);
    setSearchDrinksResult([]);
    setIsLoading(false);
  };

  return (
    <>
      <Header
        title="Drinks"
        searchIcon
      />
      {isLoading || isLoadingSearch ? <Loading />
        : (
          <div className="container-result-recipes">
            <section className="container-btn-category">
              <ButtonAll />
              {
                categoryDrinks?.map((category) => (<CategoryButtons
                  key={ category }
                  category={ category }
                  onClick={ () => fetchCategoryResult(category) }
                />))
              }
            </section>
            {/* REQUISITO 14 -> RENDERIZAR AS 12 PRIMEIRAS RECEITAS DA BUSCA */}
            <section className="container-recipes">
              { searchDrinksResult.length > 1
              && searchDrinksResult?.slice(0, MAGIC_NUMBER_TWELVE)?.map(
                ({ idDrink, strDrink, strDrinkThumb }, index) => (
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
                ),
              )}
              {
                drinksRecipes.length > 0
        && searchDrinksResult.length === 0
        && drinksRecipes?.slice(0, MAGIC_NUMBER_TWELVE)?.map(
          ({ idDrink, strDrink, strDrinkThumb }, index) => (
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
          ),
        )
              }
            </section>
          </div>
        )}
      <Footer />
    </>
  );
}
