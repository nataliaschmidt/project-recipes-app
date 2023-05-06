import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import SearchContext from './SearchContext';

function SearchProvider({ children }) {
  const [searchInput, setSearchInput] = useState('');
  const [searchRadio, setSearchRadio] = useState('');
  const [searchMealsResult, setSearchMealsResult] = useState([]);
  const [searchDrinksResult, setSearchDrinksResult] = useState([]);

  const context = useMemo(() => ({
    searchInput,
    setSearchInput,
    searchRadio,
    setSearchRadio,
    searchMealsResult,
    setSearchMealsResult,
    searchDrinksResult,
    setSearchDrinksResult,
  }), [searchInput, searchRadio, searchMealsResult, searchDrinksResult]);
  return (
    <SearchContext.Provider value={ context }>
      {children}
    </SearchContext.Provider>
  );
}

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SearchProvider;
