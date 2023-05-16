import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import SearchProvider from '../contexts/SearchContext/SearchProvider';
import RecipesMealsProvider from '../contexts/RecipesMealsContext/RecipesMealsProvider';
import RecipesDrinksProvider from '../contexts/RecipesDrinksContext/RecipesDrinksProvider';
import mockFetch, { MEALDB_URL, COCKTAILDB_URL, MealID, DrinkID } from './helpers/dataMocks/fetch';
// import { OneRecipeArrabiata } from './helpers/dataMocks/oneMealsRecipe';
import recipeInProgressMeals from './helpers/dataMocks/MealRecipeInProgress';
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
});

describe('testa se copia o link', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(recipeInProgressMeals),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('testa se copia o link', async () => {
    global.navigator.clipboard = {
      writeText: jest.fn(),
    };
    const copy = jest.spyOn(navigator.clipboard, 'writeText');

    const initialEntries = ['/meals/52977/'];
    await act(async () => {
      renderWithRouter(
        <RecipesDrinksProvider>
          <RecipesMealsProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </RecipesMealsProvider>
        </RecipesDrinksProvider>,
        { initialEntries },
      );
    });

    const shareBtn = screen.getByTestId('share-btn');
    await act(async () => {
      userEvent.click(shareBtn);
      await waitFor(() => {
        const shareText = screen.getByTestId('text-share');
        expect(copy).toHaveBeenLastCalledWith('http://localhost/');
        expect(copy).toHaveBeenCalledTimes(1);
        expect(shareText).toBeInTheDocument();
      });
    });
  });
});

describe('verifica a função de favoritar', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(recipeInProgressMeals),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('verifica se os alementos aparecem corretamente na tela', async () => {
    const initialEntries = ['/meals/52977/'];
    await act(async () => {
      renderWithRouter(
        <RecipesDrinksProvider>
          <RecipesMealsProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </RecipesMealsProvider>
        </RecipesDrinksProvider>,
        { initialEntries },
      );
    });
    await waitFor(() => {
      const recipePhoto = screen.getByRole('img', { name: /corba/i });
      const shareBtn = screen.getByTestId('share-btn');
      const favoriteBtn = screen.getByTestId('favorite-btn');
      const title = screen.getByRole('heading', { name: /corba/i });
      const category = screen.getByTestId('recipe-category');
      const instructions = screen.getByTestId('instructions');

      expect(recipePhoto).toBeInTheDocument();
      expect(shareBtn).toBeInTheDocument();
      expect(favoriteBtn).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(category).toBeInTheDocument();
      expect(instructions).toBeInTheDocument();
    });
  });

  it('testa se salva no localStorage', async () => {
    const initialEntries = ['/meals/52977/'];
    await act(async () => {
      renderWithRouter(
        <RecipesDrinksProvider>
          <RecipesMealsProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </RecipesMealsProvider>
        </RecipesDrinksProvider>,
        { initialEntries },
      );
    });

    await waitFor(async () => {
      const favoriteBtn = screen.getByTestId('favorite-btn');
      expect(favoriteBtn).toHaveAttribute('src', 'whiteHeartIcon.svg');
      userEvent.click(favoriteBtn);
      const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
      expect(favoriteBtn).toHaveAttribute('src', 'blackHeartIcon.svg');
      console.log(favoriteLocalStorage);
      expect(favoriteLocalStorage).not.toBe(null);
      expect(favoriteLocalStorage.length).toEqual(1);
    });
  });
});
