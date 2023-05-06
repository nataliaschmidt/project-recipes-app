import React, { useCallback, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SearchContext from '../contexts/SearchContext/SearchContext';

const FIRST_LETTER = 'first-letter';
export default function SearchBar() {
  const location = useLocation();
  const history = useHistory();
  const { searchInput,
    setSearchInput,
    searchRadio,
    setSearchRadio,
    setSearchMealsResult,
    setSearchDrinksResult,
    searchMealsResult,
    searchDrinksResult,
  } = useContext(SearchContext);

  const fetchSearch = async (url) => {
    let searchUrl = '';
    switch (searchRadio) {
    case 'ingredient':
      searchUrl = `${url}/filter.php?i=${searchInput}`;
      break;
    case 'name':
      searchUrl = `${url}/search.php?s=${searchInput}`;
      break;
    case FIRST_LETTER:
      searchUrl = `${url}/search.php?f=${searchInput}`;
      break;
    default:
      break;
    }
    if (searchRadio === FIRST_LETTER && searchInput.length > 1) {
      return global.alert('Your search must have only 1 (one) character');
    }

    try {
      const response = await fetch(searchUrl);

      const data = await response.json();
      if (location.pathname === '/meals') {
        setSearchMealsResult(data.meals);
      }
      if (location.pathname === '/drinks') {
        setSearchDrinksResult(data.drinks);
      }

      if (data.meals === null || data.drinks === null) {
        throw new Error('Sorry, we haven\'t found any recipes for these filters.');
      }
    } catch (error) {
      global.alert(error.message);
      setSearchDrinksResult([]);
      setSearchMealsResult([]);
    }
  };

  const handleClickSearch = (e) => {
    e.preventDefault();
    if (location.pathname === '/meals') {
      fetchSearch('https://www.themealdb.com/api/json/v1/1');
    }
    if (location.pathname === '/drinks') {
      fetchSearch('https://www.thecocktaildb.com/api/json/v1/1');
    }
  };

  const redirectOneSearchRecipie = useCallback(() => {
    if (searchMealsResult.length === 1) {
      const { idMeal } = searchMealsResult[0];
      history.push(`/meals/${idMeal}`);
    }
    if (searchDrinksResult.length === 1) {
      const { idDrink } = searchDrinksResult[0];
      history.push(`/drinks/${idDrink}`);
    }
  }, [searchMealsResult, history, searchDrinksResult]);

  useEffect(() => {
    redirectOneSearchRecipie();
  }, [redirectOneSearchRecipie]);

  return (
    <form>
      <label>
        Search:
        <input
          type="text"
          data-testid="search-input"
          name="searchInput"
          value={ searchInput }
          onChange={ ({ target }) => setSearchInput(target.value) }
        />
      </label>

      <label htmlFor="ingredient">
        Ingredient
        <input
          data-testid="ingredient-search-radio"
          type="radio"
          name="searchRadio"
          id="ingredient"
          value="ingredient"
          checked={ searchRadio === 'ingredient' }
          onChange={ ({ target }) => setSearchRadio(target.value) }
        />
      </label>

      <label htmlFor="name">
        Name
        <input
          data-testid="name-search-radio"
          type="radio"
          name="searchRadio"
          id="name"
          value="name"
          checked={ searchRadio === 'name' }
          onChange={ ({ target }) => setSearchRadio(target.value) }
        />
      </label>

      <label htmlFor="first-letter">
        First Letter
        <input
          data-testid="first-letter-search-radio"
          type="radio"
          name="searchRadio"
          id="first-letter"
          value="first-letter"
          checked={ searchRadio === 'first-letter' }
          onChange={ ({ target }) => setSearchRadio(target.value) }
        />
      </label>
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={ handleClickSearch }
      >
        Search
      </button>
    </form>
  );
}
