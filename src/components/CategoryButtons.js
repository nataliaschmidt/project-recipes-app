import React from 'react';
import '../styles/ButtonCategory.css';
import PropTypes from 'prop-types';

export default function CategoryButtons({ category, onClick }) {
  return (
    <button
      className="category-button"
      data-testid={ `${category}-category-filter` }
      onClick={ onClick }
    >
      {category}
    </button>
  );
}

CategoryButtons.propTypes = {
  category: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
