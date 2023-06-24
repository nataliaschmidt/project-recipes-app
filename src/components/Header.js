import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import ProfileIcon from '../images/profileIcon.svg';
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
          <CgProfile className="nav-icon" />
        </button>

        {
          searchIcon
          && (
            <button
              onClick={ handleClickSearch }
            >
              <BsSearch className="nav-icon" />

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
