import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';

export default function DoneRecipes() {
  const history = useHistory();
  const [doneData, setDoneData] = useState([]);
  const doneLocalStorage = JSON.parse(localStorage.getItem('doneRecipes'));
  const [filter, setFilter] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setDoneData(doneLocalStorage);
  }, []);

  const copyLink = (type, id) => {
    setCopiedLink(true);
    navigator.clipboard.writeText(`${window.location.origin}/${type}s/${id}`);
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

      <button
        data-testid="filter-by-all-btn"
        onClick={ () => setFilter('all') }
      >
        All
      </button>

      <button
        data-testid="filter-by-meal-btn"
        onClick={ () => setFilter('meals') }
      >
        Meals
      </button>

      <button
        data-testid="filter-by-drink-btn"
        onClick={ () => setFilter('drinks') }
      >
        Drinks
      </button>

      {
        doneData && (
          doneData.filter((recipe) => {
            switch (filter) {
            case 'drinks': return recipe.type === 'drink';
            case 'meals': return recipe.type === 'meal';
            default: return recipe;
            }
          }).map((recipe, index) => (
            <div key={ index }>
              <button
                type="button"
                onClick={ () => goToDetails(recipe.type, recipe.id) }
                style={ { maxWidth: '350px' } }
              >
                <img
                  data-testid={ `${index}-horizontal-image` }
                  src={ recipe.image }
                  alt="alt"
                  style={ { maxWidth: '100%' } }
                />
              </button>

              <h3
                data-testid={ `${index}-horizontal-top-text` }
              >
                { recipe.category }
              </h3>

              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <h2
                  data-testid={ `${index}-horizontal-name` }
                >
                  { recipe.name }
                </h2>
              </Link>

              <h2 data-testid={ `${index}-horizontal-done-date` }>
                { recipe.doneDate }
              </h2>

              {
                recipe.type === 'meal' ? (
                  <h2
                    data-testid={ `${index}-horizontal-top-text` }
                  >
                    {`${recipe.nationality} - ${recipe.category}`}
                  </h2>
                ) : (
                  <h2
                    data-testid={ `${index}-horizontal-top-text` }
                  >
                    { recipe.alcoholicOrNot }
                  </h2>
                )
              }

              <button onClick={ () => copyLink(recipe.type, recipe.id) }>
                <img
                  src={ shareIcon }
                  alt="share"
                  data-testid={ `${index}-horizontal-share-btn` }
                />
              </button>

              {
                recipe.type === 'meal' && (
                  recipe.tags.map((item, index2) => (
                    <h2 key={ index2 } data-testid={ `${index}-${item}-horizontal-tag` }>
                      {item}
                    </h2>
                  ))
                )
              }

              {
                copiedLink && <p data-testid="text-share">Link copied!</p>
              }
            </div>
          ))
        )

      }

    </>
  );
}
