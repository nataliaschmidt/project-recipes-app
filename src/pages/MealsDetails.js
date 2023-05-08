import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
// import Carousel from 'react-bootstrap/Carousel';
import ReactSimplyCarousel from 'react-simply-carousel';
import RecipeDetails from '../components/RecipeDetails';
import RecipesMealsContext from '../contexts/RecipesMealsContext/RecipesMealsContext';

const MAGIC_NUMBER_INGREDIENTS_LIST = 20;

export default function MealsDetails() {
  const { pathname } = useLocation();
  const idMeals = pathname.split('/')[2];
  const {
    mealDetails,
    setMealDetails,
    drinksRecommendations,
    setDrinksRecommendations,
  } = useContext(RecipesMealsContext);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  console.log(drinksRecommendations);
  const fetchMealDetails = useCallback(async () => {
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
    };

    data.meals.forEach((meal) => {
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
    });
    setMealDetails(recipeDetails);
  }, [idMeals, setMealDetails]);

  const fetchDrinksRecommendations = useCallback(async () => {
    const MAX_RECOMMENDED_NUMBER = 6;
    // const DISPLAY1 = 4;
    // const DISPLAY2 = 6;
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recommended = data.drinks.slice(0, MAX_RECOMMENDED_NUMBER);
    // const recommended1 = recommended.slice(0, 2);
    // const recommended2 = recommended.slice(2, DISPLAY1);
    // const recommended3 = recommended.slice(DISPLAY1, DISPLAY2);
    // const recommendedList = [recommended1, recommended2, recommended3];
    setDrinksRecommendations(recommended);
  }, [setDrinksRecommendations]);

  useEffect(() => {
    fetchMealDetails();
    fetchDrinksRecommendations();
  }, [fetchMealDetails, fetchDrinksRecommendations]);

  return (
    <>
      <RecipeDetails
        details={ mealDetails }
      />
      <ReactSimplyCarousel
        activeSlideIndex={ activeSlideIndex }
        onRequestChange={ setActiveSlideIndex }
        itemsToShow={ 2 }
        itemsToScroll={ 1 }
        forwardBtnProps={ {
          style: {
            alignSelf: 'center',
            background: 'black',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            height: 30,
            lineHeight: 1,
            textAlign: 'center',
            width: 30,
          },
          children: <span>{'>'}</span>,
        } }
        backwardBtnProps={ {
          style: {
            alignSelf: 'center',
            background: 'black',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            height: 30,
            lineHeight: 1,
            textAlign: 'center',
            width: 30,
          },
          children: <span>{'<'}</span>,
        } }
        speed={ 400 }
        easing="linear"
      >
        {drinksRecommendations.map((item, index) => (
          <div
            key={ item.strDrink }
            data-testid={ `${index}-recommendation-card` }
          >
            <h3
              data-testid={ `${index}-recommendation-title` }
            >
              {item.strDrink}

            </h3>
            <img src={ item.strDrinkThumb } alt={ item.strDrink } />
          </div>
        ))}
      </ReactSimplyCarousel>
      {/* <Carousel>
        {
          drinksRecommendations.map((item, index) => (
            <Carousel.Item key={ index } className="d-flex">
              {item.map((subItem, subIndex) => (
                <div
                  key={ subItem.strDrink }
                  data-testid={ `${subIndex}-recommendation-card` }
                >
                  <h3
                    data-testid={ `${subIndex}-recommendation-title` }
                  >
                    {subItem.strDrink}

                  </h3>
                  <img src={ subItem.strDrinkThumb } alt={ subItem.strDrink } />
                </div>
              ))}
            </Carousel.Item>
          ))
        }
      </Carousel> */}
    </>

  );
}
