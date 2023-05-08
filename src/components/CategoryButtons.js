import React from 'react';

import PropTypes from 'prop-types';

export default function CategoryButtons({ category, onClick }) {
  return (
    <button
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
