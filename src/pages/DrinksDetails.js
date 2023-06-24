import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import Loading from '../components/Loading';
import RecipeDetails from '../components/RecipeDetails';
import RecipesDrinksContext from '../contexts/RecipesDrinksContext/RecipesDrinksContext';
import '../styles/Carousel.css';

const MAGIC_NUMBER_INGREDIENTS_LIST = 15;

export default function DrinksDetails() {
  const history = useHistory();
  const { pathname } = useLocation();
  const idDrink = pathname.split('/')[2];
  const {
    setDrinkDetails,
    mealsRecommendations,
    setMealsRecommendations,
    startRecipeDrink,
    setStartRecipeDrink,
    setInProgressRecipesDrink,
  } = useContext(RecipesDrinksContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrinkDetails = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
    const data = await response.json();
    const recipeDetails = {
      id: '',
      image: '',
      title: '',
      alcohol: '',
      ingredients: [],
      instructions: '',
      type: 'drink',
      nationality: '',
      category: '',
    };
    data?.drinks?.forEach((drink) => {
      recipeDetails.id = drink.idDrink;
      recipeDetails.image = drink.strDrinkThumb;
      recipeDetails.title = drink.strDrink;
      recipeDetails.alcohol = drink.strAlcoholic;

      for (let index = 1; index <= MAGIC_NUMBER_INGREDIENTS_LIST; index += 1) {
        if (drink[`strIngredient${index}`]) {
          recipeDetails.ingredients.push({
            ingredient: drink[`strIngredient${index}`],
            measure: drink[`strMeasure${index}`],
          });
        }
      }
      recipeDetails.instructions = drink.strInstructions;
      recipeDetails.category = drink.strCategory;
    });
    setDrinkDetails(recipeDetails);
    setIsLoading(false);
  }, [idDrink, setDrinkDetails]);

  const fetchMealsRecommendations = useCallback(async () => {
    const MAX_RECOMMENDED_NUMBER = 6;
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recommended = data?.meals?.slice(0, MAX_RECOMMENDED_NUMBER);
    setMealsRecommendations(recommended);
  }, [setMealsRecommendations]);

  const startRecipe = () => {
    setStartRecipeDrink(true);

    const progressRecipesLocalStorage = JSON
      .parse(localStorage.getItem('inProgressRecipes'));
    const updateProgress = {
      ...progressRecipesLocalStorage,
      drinks: {
        ...progressRecipesLocalStorage.drinks,
      },
    };

    localStorage.setItem('inProgressRecipes', JSON.stringify(updateProgress));

    history.push(`/drinks/${idDrink}/in-progress`);
  };

  const continueRecipe = useCallback(() => {
    const isInProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (isInProgressRecipes.drinks
      && Object.keys(isInProgressRecipes.drinks)[0] === idDrink) {
      setInProgressRecipesDrink(true);
      setStartRecipeDrink(true);
    } else {
      setInProgressRecipesDrink(false);
      setStartRecipeDrink(false);
    }
  }, [setInProgressRecipesDrink, idDrink, setStartRecipeDrink]);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('inProgressRecipes'))) {
      localStorage.setItem('inProgressRecipes', JSON.stringify({}));
    }
    fetchDrinkDetails();
    fetchMealsRecommendations();
    continueRecipe();
  }, [fetchDrinkDetails, fetchMealsRecommendations, continueRecipe]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div>
      {
        isLoading ? <Loading />
          : (
            <>
              <RecipeDetails />

              <Slider { ...settings }>

                {mealsRecommendations?.map((item, index) => (
                  <div
                    key={ item.strMeal }
                    data-testid={ `${index}-recommendation-card` }
                    className="container-card-carousel"
                  >
                    <img
                      className="carousel-img"
                      src={ item.strMealThumb }
                      alt={ item.strMeal }
                    />
                    <h3
                      data-testid={ `${index}-recommendation-title` }
                    >
                      {item.strMeal}

                    </h3>
                  </div>
                ))}

              </Slider>

              <button
                data-testid="start-recipe-btn"
                onClick={ startRecipe }
                className="btn-start-recipe"
              >
                {!startRecipeDrink ? 'Start Recipe' : 'Continue Recipe'}
              </button>
            </>
          )
      }
    </div>
  );
}
