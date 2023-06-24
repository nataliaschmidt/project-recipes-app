import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Recipe.css';

export default function Recipes({ image, name, index }) {
  return (
    <div data-testid={ `${index}-recipe-card` } className="container-recipe">
      <img
        data-testid={ `${index}-card-img` }
        src={ image }
        alt={ `Recipe ${name}` }
      />
      <h2 data-testid={ `${index}-card-name` }>{name}</h2>
    </div>
  );
}

Recipes.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
