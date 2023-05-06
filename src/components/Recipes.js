import React from 'react';
import PropTypes from 'prop-types';

export default function Recipes({ image, name, index }) {
  return (
    <div data-testid={ `${index}-recipe-card` }>
      <img
        data-testid={ `${index}-card-img` }
        src={ image }
        alt={ `Recipe ${name}` }
      />
      <h3 data-testid={ `${index}-card-name` }>{name}</h3>
    </div>
  );
}

Recipes.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
