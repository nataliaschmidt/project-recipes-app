import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import SearchProvider from '../contexts/SearchContext/SearchProvider';
import RecipesMealsProvider from '../contexts/RecipesMealsContext/RecipesMealsProvider';
import RecipesDrinksProvider from '../contexts/RecipesDrinksContext/RecipesDrinksProvider';
import recipeInProgressMeals from './helpers/dataMocks/MealRecipeInProgress';
import App from '../App';
import drinkRecipeInProress from './helpers/dataMocks/DrinkRecipeInProgress';

const idShareBtn = 'share-btn';
const idFavoriteBtn = 'favorite-btn';
const idCheckBox = /-ingredient-step$/i;
const idCategory = 'recipe-category';
const idInstructions = 'instructions';
const idFinishRecipe = 'finish-recipe-btn';
const underlineChecked = 'underline-checked';
const routeMeals = '/meals/52977/in-progress';

describe(
  'Testando o componente de Receita em Progresso na rota Meals',
  () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(recipeInProgressMeals),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Verifica os elementos na tela', async () => {
      const initialEntries = [routeMeals];
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
        const shareBtn = screen.getByTestId(idShareBtn);
        const favoriteBtn = screen.getByTestId(idFavoriteBtn);
        const labelCheckBox = screen.getAllByTestId(idCheckBox);
        const title = screen.getByRole('heading', { name: /corba/i });
        const category = screen.getByTestId(idCategory);
        const instructions = screen.getByTestId(idInstructions);
        const finishRecipe = screen.getByTestId(idFinishRecipe);

        expect(recipePhoto).toBeInTheDocument();
        expect(shareBtn).toBeInTheDocument();
        expect(favoriteBtn).toBeInTheDocument();
        expect(labelCheckBox.length).toEqual(13);
        expect(labelCheckBox[0].classList.contains(underlineChecked)).toBeFalsy();
        expect(title).toBeInTheDocument();
        expect(category).toBeInTheDocument();
        expect(instructions).toBeInTheDocument();
        expect(finishRecipe).toBeInTheDocument();
        expect(finishRecipe).toBeDisabled();
      });
    });

    it('Verifica se ao clicar em um checkbox, ele recebe a classe sublinhada e é salvo no localStorage', async () => {
      const initialEntries = [routeMeals];
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
        const labelCheckBox = screen.getAllByTestId(idCheckBox);

        expect(labelCheckBox[0].classList.contains(underlineChecked)).toBeFalsy();
        userEvent.click(labelCheckBox[0]);
        expect(labelCheckBox[0].classList.contains(underlineChecked)).toBeTruthy();

        const recoveredLocalStorage = JSON.parse(localStorage.getItem('inProgressRecipes')).meals;
        console.log(recoveredLocalStorage['52977'][0]);
        expect(recoveredLocalStorage['52977'][0]).toEqual('Lentils');
      });
    });

    it('Verifica se ao encerrar uma receita o botão de finalizar habilita ', async () => {
      const initialEntries = [routeMeals];
      const finishRecipeLocalStorage = {
        drinks: {},
        meals: {
          52977: ['Lentils', 'Carrots', 'Paprika', 'Tomato Puree', 'Onion', 'Cumin', 'Mint', 'Thyme', 'Black Pepper', 'Red Pepper Flakes', 'Vegetable Stock', 'Water', 'Sea Salt'],
        },
      };

      localStorage.setItem('inProgressRecipes', JSON.stringify(finishRecipeLocalStorage));
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
        const labelCheckBox = screen.getAllByTestId(idCheckBox);
        const finishRecipeBtn = screen.getByTestId(idFinishRecipe);

        const getLocalStorage = JSON.parse(localStorage.getItem('inProgressRecipes')).meals['52977'];
        const compareCheckedRecipesWithLocalStorage = getLocalStorage
          .length === labelCheckBox.length;
        expect(compareCheckedRecipesWithLocalStorage).toBe(true);
        expect(finishRecipeBtn).toBeEnabled();

        userEvent.click(finishRecipeBtn);

      });
    });

    it('Verifica se ao favoritar uma receita ela é salva no locaStorage e o ícone alterado', async () => {
      const initialEntries = [routeMeals];
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
        const favoriteBtn = screen.getByTestId(idFavoriteBtn);

        expect(favoriteBtn).toHaveAttribute('src', 'whiteHeartIcon.svg');
        userEvent.click(favoriteBtn);
        const favoriteLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
        expect(favoriteBtn).toHaveAttribute('src', 'blackHeartIcon.svg');
        console.log(favoriteLocalStorage);
        expect(favoriteLocalStorage).not.toBe(null);
        expect(favoriteLocalStorage.length).toEqual(1);
      });
    });

    it('Verifica se ao clicar no botão de compartilhar, o link da receita é copiado', async () => {
      global.navigator.clipboard = {
        writeText: jest.fn(),
      };
      const copy = jest.spyOn(navigator.clipboard, 'writeText');

      const initialEntries = ['/meals/52977/in-progress'];
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

      const shareBtn = screen.getByTestId(idShareBtn);
      const shareText = screen.getByTestId('text-share');
      await act(async () => {
        userEvent.click(shareBtn);
        await waitFor(() => {
          expect(copy).toHaveBeenLastCalledWith('http://localhost');
          expect(copy).toHaveBeenCalledTimes(1);
          expect(shareText).toBeInTheDocument();
        });
      });
    });
  },
);

describe(
  'Testando o componente de Receita em Progresso na rota Drinks',
  () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(drinkRecipeInProress),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Verifica os elementos na tela', async () => {
      const initialEntries = ['/drinks/15997/in-progress'];
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
        expect(screen.getByText(/optional alcohol/i)).toBeInTheDocument();
      });
    });

    it('Verifica se ao clicar no checkBox e depois clicar novamente se o sublinhado é removido', async () => {
      const initialEntries = ['/drinks/15997/in-progress'];
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
        const labelCheckBox = screen.getAllByTestId(idCheckBox);

        act(() => {
          userEvent.click(labelCheckBox[0]);
        });
        expect(labelCheckBox[0].classList.contains(underlineChecked)).toBeTruthy();
        act(() => {
          userEvent.click(labelCheckBox[0]);
        });
        expect(labelCheckBox[0].classList.contains(underlineChecked)).toBeFalsy();
      });
    });
  },
);
