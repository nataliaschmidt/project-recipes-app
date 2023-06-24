import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import Loading from '../components/Loading';
import RecipeDetails from '../components/RecipeDetails';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';
import '../styles/Carousel.css';

const MAGIC_NUMBER_INGREDIENTS_LIST = 20;

export default function MealsDetails() {
  const history = useHistory();
  const { pathname } = useLocation();
  const idMeals = pathname.split('/')[2];
  const {
    setMealDetails,
    drinksRecommendations,
    setDrinksRecommendations,
    startRecipeMeal,
    setStartRecipeMeal,
    setInProgressRecipesMeal,
  } = useContext(RecipesMealsContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMealDetails = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeals}`);
    const data = await response.json();
    const recipeDetails = {
      id: '',
      image: '',
      title: '',
      category: '',
      ingredients: [],
      instructions: '',
      video: '',
      type: 'meal',
      nationality: '',
    };

    data?.meals?.forEach((meal) => {
      recipeDetails.id = meal.idMeal;
      recipeDetails.image = meal.strMealThumb;
      recipeDetails.title = meal.strMeal;
      recipeDetails.category = meal.strCategory;

      for (let index = 1; index <= MAGIC_NUMBER_INGREDIENTS_LIST; index += 1) {
        if (meal[`strIngredient${index}`]) {
          recipeDetails.ingredients.push({
            ingredient: meal[`strIngredient${index}`],
            measure: meal[`strMeasure${index}`],
          });
        }
      }
      recipeDetails.instructions = meal.strInstructions;
      recipeDetails.video = meal.strYoutube;
      recipeDetails.nationality = meal.strArea;
    });
    setMealDetails(recipeDetails);
    setIsLoading(false);
  }, [idMeals, setMealDetails]);

  const fetchDrinksRecommendations = useCallback(async () => {
    const MAX_RECOMMENDED_NUMBER = 6;
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recommended = data?.drinks?.slice(0, MAX_RECOMMENDED_NUMBER);
    setDrinksRecommendations(recommended);
  }, [setDrinksRecommendations]);

  const startRecipe = () => {
    setStartRecipeMeal(true);

    const progressRecipesLocalStorage = JSON
      .parse(localStorage.getItem('inProgressRecipes'));
    const updateProgress = {
      ...progressRecipesLocalStorage,
      meals: {
        ...progressRecipesLocalStorage.meals,
      },
    };

    localStorage.setItem('inProgressRecipes', JSON.stringify(updateProgress));

    history.push(`/meals/${idMeals}/in-progress`);
  };

  const continueRecipe = useCallback(() => {
    const isInProgressRecipes = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || {};
    if (isInProgressRecipes.meals
      && Object.keys(isInProgressRecipes.meals)[0] === idMeals) {
      setInProgressRecipesMeal(true);
      setStartRecipeMeal(true);
    } else {
      setInProgressRecipesMeal(false);
      setStartRecipeMeal(false);
    }
  }, [setInProgressRecipesMeal, idMeals, setStartRecipeMeal]);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('inProgressRecipes'))) {
      localStorage.setItem('inProgressRecipes', JSON.stringify({}));
    }
    fetchMealDetails();
    fetchDrinksRecommendations();
    continueRecipe();
  }, [fetchMealDetails, fetchDrinksRecommendations, continueRecipe]);

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
      {isLoading ? <Loading />
        : (
          <>
            <RecipeDetails />

            <Slider { ...settings }>

              {drinksRecommendations?.map((item, index) => (
                <div
                  key={ item.strDrink }
                  data-testid={ `${index}-recommendation-card` }
                  className="container-card-carousel"
                >
                  <img
                    className="carousel-img"
                    src={ item.strDrinkThumb }
                    alt={ item.strDrink }
                  />
                  <h3
                    data-testid={ `${index}-recommendation-title` }
                  >
                    {item.strDrink}

                  </h3>
                </div>
              ))}

            </Slider>

            <button
              data-testid="start-recipe-btn"
              onClick={ startRecipe }
              className="btn-start-recipe"
            >
              {!startRecipeMeal ? 'Start Recipe' : 'Continue Recipe'}
            </button>
          </>
        ) }
    </div>
  );
}
