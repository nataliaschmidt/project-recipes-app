import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Recipes from '../components/Recipes';

import SearchContext from '../contexts/SearchContext/SearchContext';

const MAGIC_NUMBER_SLICE = 12;

export default function Drinks() {
  const { searchDrinksResult } = useContext(SearchContext);
  return (
    <>
      <Header
        title="Drinks"
        searchIcon
      />
      {/* REQUISITO 14 -> RENDERIZAR AS 12 PRIMEIRAS RECEITAS DA BUSCA */}
      { searchDrinksResult.length > 1 && searchDrinksResult.slice(0, MAGIC_NUMBER_SLICE)
        .map(({ idDrink, strDrink, strDrinkThumb }, index) => (<Recipes
          key={ idDrink }
          image={ strDrinkThumb }
          name={ strDrink }
          index={ index }
        />))}
      <Footer />
    </>
  );
}
