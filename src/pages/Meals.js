import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Recipes from '../components/Recipes';

import SearchContext from '../contexts/SearchContext/SearchContext';

const MAGIC_NUMBER_SLICE = 12;
export default function Meals() {
  const { searchMealsResult } = useContext(SearchContext);
  return (
    <>
      <Header
        title="Meals"
        searchIcon
      />
      {/* REQUISITO 14 -> RENDERIZAR AS 12 PRIMEIRAS RECEITAS DA BUSCA */}
      { searchMealsResult.length > 1 && searchMealsResult.slice(0, MAGIC_NUMBER_SLICE)
        .map(({ idMeal, strMeal, strMealThumb }, index) => (<Recipes
          key={ idMeal }
          image={ strMealThumb }
          name={ strMeal }
          index={ index }
        />))}
      <Footer />
    </>
  );
}
