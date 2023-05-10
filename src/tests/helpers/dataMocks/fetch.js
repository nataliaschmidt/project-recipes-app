// import mealsApi from './MealsApi';
import DrinksApi from './DrinksApi';
import MealsApi from './MealsApi';
import { OneRecipeArrabiata } from './oneMealsRecipe';
import { YellowBird } from './oneDrinkRecipe';

export const MEALDB_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
export const COCKTAILDB_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
export const MealID = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771';
export const DrinkID = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=17219';

const mockFetch = (url) => Promise.resolve({
  json: () => {
    switch (url) {
    case MealID:
      return Promise.resolve(OneRecipeArrabiata);
    case COCKTAILDB_URL:
      return Promise.resolve(DrinksApi);
    case MEALDB_URL:
      return Promise.resolve(MealsApi);
    case DrinkID:
      return Promise.resolve(YellowBird);
    default:
      break;
    }
  },
});

export default mockFetch;
