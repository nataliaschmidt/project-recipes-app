import React from 'react';

function RecommendationCard({ title, image, index }) {
  return (
    <div data-testid={ `${index}-recommendation-card` }>
      <h3 data-testid={ `${index}-recommendation-title` }>{title}</h3>
      <img src={ image } alt={ title } />
    </div>
  );
}

export default RecommendationCard;
