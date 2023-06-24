import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import copy from 'clipboard-copy';
import { IoHeartOutline, IoHeartSharp, IoShareSocialOutline } from 'react-icons/io5';
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
    const magicNumberTimeLink = 1000;
    const url = window.location.href.split('/');
    const urlToCopy = url.slice(0, -magicNumber).join('/');
    await copy(urlToCopy);
    setLinkCopy('Link copied!');
    setTimeout(() => {
      setLinkCopy(false);
    }, magicNumberTimeLink);
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
    const verifyFavoriteRecipe = favoriteLocalStorage?.some(
      (item) => item.id === newFavorite.id,
    );
    if (!verifyFavoriteRecipe) {
      localStorage.setItem('favoriteRecipes', JSON
        .stringify([...favoriteLocalStorage, newFavorite]));
      setIsFavorite(true);
    } else {
      const removeFavorite = favoriteLocalStorage?.filter(
        (item) => item.id !== newFavorite.id,
      );
      localStorage.setItem('favoriteRecipes', JSON.stringify(removeFavorite));
      setIsFavorite(false);
    }
  };

  return (
    <>

      <button
        className="button-favorite neumorphism"
        onClick={ () => handleClickFavorite(recipeInProgress) }
      >
        {
          isFavorite ? <IoHeartSharp className="heart-favorite-icon" />
            : (
              <IoHeartOutline
                className="heart-unfavorite-icon"
              />
            )
        }

      </button>
      <button
        className="button-share neumorphism"
        onClick={ handleClickCopy }
      >
        <IoShareSocialOutline className="share-icon" />

      </button>
      <span data-testid="text-share" className="link-copied">{linkCopy}</span>
    </>
  );
}
