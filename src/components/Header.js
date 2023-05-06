import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ProfileIcon from '../images/profileIcon.svg';
import SearcheIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';
import '../styles/Header.css';

export default function Header({ title, searchIcon }) {
  const [isSearched, setIsSearched] = useState(false);
  const history = useHistory();

  const handleClickSearch = () => {
    setIsSearched(!isSearched);
  };

  return (
    <header>
      <nav>
        <button
          onClick={ () => history.push('/profile') }
          src={ ProfileIcon }
        >
          <img
            data-testid="profile-top-btn"
            src={ ProfileIcon }
            alt="Perfil icon"
          />
        </button>

        {
          searchIcon
        && (
          <button
            onClick={ handleClickSearch }
          >
            <img
              data-testid="search-top-btn"
              src={ SearcheIcon }
              alt="Search icon"
            />
          </button>
        )
        }
      </nav>
      <h1 data-testid="page-title">{ title }</h1>
      {
        isSearched && <SearchBar />
      }
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  searchIcon: PropTypes.bool.isRequired,
};
