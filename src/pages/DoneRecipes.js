import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from 'react-router-dom';
import { IoShareSocialOutline } from 'react-icons/io5';
import Header from '../components/Header';
import '../styles/DoneRecipes.css';

export default function DoneRecipes() {
  const getDoneLocalStorage = () => {
    const doneLocalStorage = JSON.parse(localStorage.getItem('doneRecipes'));
    if (doneLocalStorage) {
      return doneLocalStorage;
    }
    return [];
  };
  const history = useHistory();
  const [doneData] = useState(getDoneLocalStorage());
  // const [doneData, setDoneData] = useState(getDoneLocalStorage());
  const [filter, setFilter] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);
  // useEffect(() => {
  //   setDoneData(doneLocalStorage);
  // }, []);

  const copyLink = (type, id) => {
    const magicNumber = 1000;
    setCopiedLink(true);
    navigator.clipboard.writeText(`${window.location.origin}/${type}s/${id}`);
    setTimeout(() => {
      setCopiedLink(false);
    }, magicNumber);
  };

  const goToDetails = (type, id) => {
    history.push(`/${type}s/${id}`);
  };

  return (
    <>
      <Header
        title="Done Recipes"
        searchIcon={ false }
      />
      {
        copiedLink
        && (
          <p
            className="link-copied-done"
            data-testid="text-share"
          >
            Link copied!

          </p>
        )
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
          doneData && (
            doneData?.filter((recipe) => {
              switch (filter) {
              case 'drinks': return recipe.type === 'drink';
              case 'meals': return recipe.type === 'meal';
              default: return recipe;
              }
            })?.map((recipe, index) => (
              <div className="card-recipe-done" key={ index }>
                <button
                  type="button"
                  onClick={ () => goToDetails(recipe.type, recipe.id) }
                >
                  <img
                    className="image-recipe"
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                    alt="alt"
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

                  <h2 data-testid={ `${index}-horizontal-done-date` }>
                    { `Done on: ${recipe.doneDate.split('T')[0]}` }
                  </h2>

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
                  <h2>Tags:</h2>
                  {
                    recipe.type === 'meal' && (
                      recipe.tags?.map((item, index2) => (
                        <h2
                          key={ index2 }
                          data-testid={ `${index}-${item}-horizontal-tag` }
                        >
                          {item}
                        </h2>
                      ))
                    )
                  }

                </div>
                <button
                  onClick={ () => copyLink(recipe.type, recipe.id) }
                  className="btn-share-recipes"
                >
                  <IoShareSocialOutline className="share-icon" />
                </button>
              </div>
            ))
          )

        }
      </div>
    </>
  );
}
