import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { IoHeartSharp, IoShareSocialOutline } from 'react-icons/io5';
import Header from '../components/Header';
import '../styles/FavoriteRecipes.css';

export default function FavoriteRecipes() {
  const history = useHistory();
  const [favoriteData, setFavoriteData] = useState([]);
  const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const [filter, setFilter] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setFavoriteData(favoriteLocalStorage);
  }, []);

  const unFavorite = (id) => {
    const favoritedStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newFavorited = favoritedStorage?.filter((clicked) => clicked.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorited));
    setFavoriteData(newFavorited);
  };

  const goToDetails = (type, id) => {
    history.push(`/${type}s/${id}`);
  };

  const copyLink = (type, id) => {
    const magicNumber = 1000;
    setCopiedLink(true);
    navigator.clipboard.writeText(`${window.location.origin}/${type}s/${id}`);
    setTimeout(() => {
      setCopiedLink(false);
    }, magicNumber);
  };

  return (
    <>
      <Header
        title="Favorite Recipes"
        searchIcon={ false }
      />

      {
        copiedLink && <p className="link-copied-done">Link copied!</p>
      }
      <div className="container-buttons-filters">
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => setFilter('all') }
          className="category-button"
        >
          All
        </button>

        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => setFilter('meals') }
          className="category-button"
        >
          Meals
        </button>

        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => setFilter('drinks') }
          className="category-button"
        >
          Drinks
        </button>
      </div>

      <div className="container-card-done-recipe">
        {
          favoriteData && (
            favoriteData?.filter((recipe) => {
              switch (filter) {
              case 'drinks': return recipe.type === 'drink';
              case 'meals': return recipe.type === 'meal';
              default: return recipe;
              }
            })?.map((recipe, index) => (
              <div
                key={ index }
                className="card-recipe-done favorite"
              >
                <button
                  type="button"
                  onClick={ () => goToDetails(recipe.type, recipe.id) }
                  style={ { maxWidth: '350px' } }
                >
                  <img
                    className="image-recipe"
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                    alt={ recipe.name }
                    style={ { maxWidth: '100%' } }
                  />
                </button>

                <div className="container-recipe-infos">
                  <Link className="link" to={ `/${recipe.type}s/${recipe.id}` }>
                    <h2
                      data-testid={ `${index}-horizontal-name` }
                    >
                      { recipe.name }
                    </h2>
                  </Link>

                  <h3
                    data-testid={ `${index}-horizontal-top-text` }
                  >
                    { `Category: ${recipe.category}` }
                  </h3>

                  {
                    recipe.type === 'meal' ? (
                      <h2
                        data-testid={ `${index}-horizontal-top-text` }
                      >
                        {`Nationality: ${recipe.nationality}`}
                      </h2>
                    ) : (
                      <h2
                        data-testid={ `${index}-horizontal-top-text` }
                      >
                        { `Alcoholic: ${recipe.alcoholicOrNot}` }
                      </h2>
                    )
                  }

                </div>
                <div className="container-buttons">
                  <button
                    className="btn-page-favorite"
                    onClick={ () => unFavorite(recipe.id) }
                  >
                    <IoHeartSharp className="heart-favorite-icon" />
                  </button>

                  <button
                    className="btn-page-favorite"
                    onClick={ () => copyLink(recipe.type, recipe.id) }
                  >
                    <IoShareSocialOutline className="share-icon" />
                  </button>

                </div>
              </div>
            ))
          )
        }

      </div>
    </>
  );
}
