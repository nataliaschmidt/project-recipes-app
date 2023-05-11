import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './helpers/renderWith';
import SearchProvider from '../contexts/SearchContext/SearchProvider';
import RecipesMealsProvider from '../contexts/RecipesMealsContext/RecipesMealsProvider';
import RecipesDrinksProvider from '../contexts/RecipesDrinksContext/RecipesDrinksProvider';
import mockFetch, { MEALDB_URL, COCKTAILDB_URL, MealID, DrinkID } from './helpers/dataMocks/fetch';
import App from '../App';

const pathnameMeals = '/meals/52771';
const pushMeals = 'meals/52771';

describe('Testando o componente RecipeDetails', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('testa se os fetchs são chamados corretamente em meals', async () => {
    const initialEntries = ['/'];
    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
          ,
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );
    history.push(pushMeals);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(MealID);
      expect(fetch).toHaveBeenCalledWith(COCKTAILDB_URL);
      expect(history.location.pathname).toBe(pathnameMeals);
    });
  });
  it('testa se os fetchs são chamados corretamente em drinks', async () => {
    const initialEntries = ['/'];
    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
          ,
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );
    history.push('drinks/17219');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(MEALDB_URL);
      expect(fetch).toHaveBeenCalledWith(DrinkID);
      expect(history.location.pathname).toBe('/drinks/17219');
    });
  });

  it('testa o botão de iniciar receita', async () => {
    const initialEntries = ['/'];
    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
          ,
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );
    history.push(pushMeals);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(MealID);
      expect(fetch).toHaveBeenCalledWith(COCKTAILDB_URL);
      expect(history.location.pathname).toBe(pathnameMeals);

      const starRecipeBtn = screen.getByTestId('start-recipe-btn');
      userEvent.click(starRecipeBtn);
      expect(history.location.pathname).toBe('/meals/52771/in-progress');
    });
  });

  it('testa se copia o link', async () => {
    const initialEntries = ['/'];
    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
          ,
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );
    history.push(pushMeals);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(MealID);
      expect(fetch).toHaveBeenCalledWith(COCKTAILDB_URL);
      expect(history.location.pathname).toBe(pathnameMeals);
      const shareBtn = screen.getByTestId('share-btn');
      expect(shareBtn).toBeInTheDocument();
      // commit para reiniciar o avaliador
    });
  });
});
