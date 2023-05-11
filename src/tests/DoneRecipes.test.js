import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import SearchProvider from '../contexts/SearchContext/SearchProvider';
import RecipesMealsProvider from '../contexts/RecipesMealsContext/RecipesMealsProvider';
import RecipesDrinksProvider from '../contexts/RecipesDrinksContext/RecipesDrinksProvider';
import App from '../App';

const doneRecipes = [
  {
    alcoholicOrNot: '',
    category: 'Side',
    doneDate: '2023-05-11T00:15:24.840Z',
    id: '52977',
    image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    name: 'Corba',
    nationality: 'Turkish',
    tags: ['Soup'],
    type: 'meal',
  },
  {
    alcoholicOrNot: 'Optional alcohol',
    category: 'Ordinary Drink',
    doneDate: '2023-05-11T12:07:47.270Z',
    id: '15997',
    image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
    name: 'GG',
    nationality: '',
    tags: [],
    type: 'drink',
  },
];

const idBtnAll = 'filter-by-all-btn';
const idBtnDrinks = 'filter-by-drink-btn';
const idBtnMeals = 'filter-by-meal-btn';
const idBtnShare = /-horizontal-share-btn$/i;
const idImage = /-horizontal-image$/i;
const idTags = /-horizontal-tag/i;
const doneRecipesInitialEntries = ['/done-recipes'];

describe('Teste da página de receitas prontas', () => {
  beforeEach(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  it('Testa se os elementos estão na tela', () => {
    const initialEntries = doneRecipesInitialEntries;

    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );

    expect(history.location.pathname).toBe(...initialEntries);
    const imagem = screen.getAllByTestId(idImage);
    const tag = screen.getAllByTestId(idTags);

    expect(imagem.length).toEqual(2);
    expect(tag.length).toEqual(1);
    expect(screen.getByRole('heading', { name: /corba/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /2023-05-11t00:15:24\.840z/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /turkish - side/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /soup/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ordinary drink/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /gg/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /2023-05-11t12:07:47\.270z/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /optional alcohol/i })).toBeInTheDocument();
  });

  it('Testa se ao clicar no botão de Meals, apenas a receita de meals está na tela', () => {
    const initialEntries = doneRecipesInitialEntries;

    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );

    const btnMeals = screen.getByTestId(idBtnMeals);

    expect(history.location.pathname).toBe(...initialEntries);
    act(() => {
      userEvent.click(btnMeals);
    });

    const imagem = screen.getAllByTestId(idImage);
    const tag = screen.getAllByTestId(idTags);

    expect(imagem.length).toEqual(1);
    expect(tag.length).toEqual(1);
    expect(screen.getByRole('heading', { name: /corba/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /2023-05-11t00:15:24\.840z/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /turkish - side/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /soup/i })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { name: /ordinary drink/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /gg/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /2023-05-11t12:07:47\.270z/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /optional alcohol/i })).not.toBeInTheDocument();

    userEvent.click(imagem[0]);
    expect(history.location.pathname).toBe('/meals/52977');
  });

  it('Testa se ao clicar no botão de Drinks, apenas a receita de drink está na tela', () => {
    const initialEntries = doneRecipesInitialEntries;

    const { history } = renderWithRouter(
      <RecipesDrinksProvider>
        <RecipesMealsProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </RecipesMealsProvider>
      </RecipesDrinksProvider>,
      { initialEntries },
    );

    const btnDrinks = screen.getByTestId(idBtnDrinks);

    expect(history.location.pathname).toBe(...initialEntries);
    act(() => {
      userEvent.click(btnDrinks);
    });

    const imagem = screen.getAllByTestId(idImage);
    const tag = screen.queryAllByTestId(idTags);

    expect(imagem.length).toEqual(1);
    expect(tag).toEqual([]);
    expect(screen.getByRole('heading', { name: /ordinary drink/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /gg/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /2023-05-11t12:07:47\.270z/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /optional alcohol/i })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { name: /corba/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /2023-05-11t00:15:24\.840z/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /turkish - side/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /soup/i })).not.toBeInTheDocument();

    const btnAll = screen.getByTestId(idBtnAll);

    act(() => {
      userEvent.click(btnAll);
    });
    const imagemAll = screen.getAllByTestId(idImage);
    expect(imagemAll.length).toEqual(2);
    expect(screen.getByRole('heading', { name: /corba/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /gg/i })).toBeInTheDocument();
  });

  it('Testa se ao clicar no botão compartilhar o link para a página de detalhes da receita será copiado', () => {
    global.navigator.clipboard = {
      writeText: jest.fn(),
    };
    const copy = jest.spyOn(navigator.clipboard, 'writeText');

    const initialEntries = doneRecipesInitialEntries;

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

    const btnShare = screen.getAllByTestId(idBtnShare);

    act(() => {
      userEvent.click(btnShare[0]);
    });
    expect(copy).toHaveBeenLastCalledWith('http://localhost/meals/52977');
    expect(copy).toHaveBeenCalledTimes(1);
  });
});
