import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import copy from 'clipboard-copy';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
// comentando para commitar
export default function ButtonsFavoriteAndShare(recipeInProgress) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkCopy, setLinkCopy] = useState('');
  const location = useLocation();
  const idPath = location.pathname.split('/')[2];
  useEffect(() => {
    setLinkCopy('');
    if (!JSON.parse(localStorage.getItem('favoriteRecipes'))) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    }
    const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const verifyFavoriteRecipe = favoriteLocalStorage
      .some((recipe) => recipe.id === idPath);
    if (verifyFavoriteRecipe) {
      setIsFavorite(true);
    }
  }, [location.pathname, idPath]);

  const handleClickCopy = async () => {
    const magicNumber = 1;
    const url = window.location.href.split('/');
    const urlToCopy = url.slice(0, -magicNumber).join('/');
    await copy(urlToCopy);
    setLinkCopy('Link copied!');
  };

  const handleClickFavorite = ({ recipeInProgress:
    { id, type, nationality, category, alcohol, title, image } }) => {
    let newFavorite = {};
    if (location.pathname.includes('meals')) {
      newFavorite = {
        id,
        type,
        nationality,
        category,
        alcoholicOrNot: '',
        name: title,
        image,
      };
    }
    if (location.pathname.includes('drinks')) {
      newFavorite = {
        id,
        type,
        nationality: '',
        category,
        alcoholicOrNot: alcohol,
        name: title,
        image,
      };
    }
    const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const verifyFavoriteRecipe = favoriteLocalStorage
      .some((item) => item.id === newFavorite.id);
    if (!verifyFavoriteRecipe) {
      localStorage.setItem('favoriteRecipes', JSON
        .stringify([...favoriteLocalStorage, newFavorite]));
      setIsFavorite(true);
    } else {
      const removeFavorite = favoriteLocalStorage
        .filter((item) => item.id !== newFavorite.id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(removeFavorite));
      setIsFavorite(false);
    }
  };

  return (
    <>
      <button
        data-testid="share-btn"
        onClick={ handleClickCopy }
      >
        Compartilhar

      </button>
      <span>{linkCopy}</span>

      <button
        onClick={ () => handleClickFavorite(recipeInProgress) }
      >
        <img
          data-testid="favorite-btn"
          src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          alt="Perfil icon"
        />

      </button>
    </>
  );
}
