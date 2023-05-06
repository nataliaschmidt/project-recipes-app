import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import SearchProvider from '../contexts/SearchContext/SearchProvider';
import SearchBar from '../components/SearchBar';
import Meals from '../pages/Meals';
import { mockChickenIgredient } from './helpers/dataMocks/chickenIngredient';
import { OneRecipeArrabiata } from './helpers/dataMocks/oneMealsRecipe';
import Drinks from '../pages/Drinks';
import { margaritaName } from './helpers/dataMocks/margaritaName';
import { drinkFirstLetterY } from './helpers/dataMocks/drinkFirstLetter';

const DATA_TESTID_BUTTON_SEARCH = 'exec-search-btn';
const SEARCH_INPUT = 'search-input';
const SEARCH_TOP_BTN = 'search-top-btn';

describe('Testando o componente SearchBar', () => {
  it('Verifica se os componentes estão sendo renderizados corretamente na tela', () => {
    const initialEntries = ['/meals'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <SearchBar />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/meals');
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioIngredient = screen.getByRole('radio', { name: /ingredient/i });
    const radioName = screen.getByRole('radio', { name: /name/i });
    const radioFirstLetter = screen.getByRole('radio', { name: /first letter/i });
    const buttonSearch = screen.getByTestId(DATA_TESTID_BUTTON_SEARCH);
    expect(inputSearch).toBeInTheDocument();
    expect(radioIngredient).toBeInTheDocument();
    expect(radioName).toBeInTheDocument();
    expect(radioFirstLetter).toBeInTheDocument();
    expect(buttonSearch).toBeInTheDocument();
  });

  it('Verifica se ao realizar uma pesquisa por ingrediente na rota "/meals", a lista aparece na tela', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockChickenIgredient),
    });

    const initialEntries = ['/meals'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <Meals />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/meals');
    const buttonIconSearch = screen.getByTestId(SEARCH_TOP_BTN);
    act(() => {
      userEvent.click(buttonIconSearch);
    });
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioIngredient = screen.getByRole('radio', { name: /ingredient/i });
    const buttonSearch = screen.getByTestId(DATA_TESTID_BUTTON_SEARCH);

    act(() => {
      userEvent.type(inputSearch, 'chicken');
      userEvent.click(radioIngredient);
      userEvent.click(buttonSearch);
    });

    await waitFor(() => {
      const recipesName = screen.getAllByTestId(/card-name/i);
      expect(recipesName.length).toEqual(11);
    });
  });

  it('Verifica se ao realizar uma pesquisa por name na rota "/drinks", a lista aparece na tela', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(margaritaName),
    });

    const initialEntries = ['/drinks'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <Drinks />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/drinks');
    const buttonIconSearch = screen.getByTestId(SEARCH_TOP_BTN);
    act(() => {
      userEvent.click(buttonIconSearch);
    });
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioName = screen.getByRole('radio', { name: /name/i });
    const buttonSearch = screen.getByTestId(DATA_TESTID_BUTTON_SEARCH);

    act(() => {
      userEvent.type(inputSearch, 'margarita');
      userEvent.click(radioName);
      userEvent.click(buttonSearch);
    });

    await waitFor(() => {
      const recipesName = screen.getAllByTestId(/card-name/i);
      expect(recipesName.length).toEqual(6);
    });
  });

  it('Verifica se ao realizar uma pesquisa por firstLetter na rota "/drinks", a lista aparece na tela', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinkFirstLetterY),
    });

    const initialEntries = ['/drinks'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <Drinks />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/drinks');
    const buttonIconSearch = screen.getByTestId(SEARCH_TOP_BTN);
    act(() => {
      userEvent.click(buttonIconSearch);
    });
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioFirstLetter = screen.getByRole('radio', { name: /first letter/i });
    const buttonSearch = screen.getByTestId(DATA_TESTID_BUTTON_SEARCH);

    act(() => {
      userEvent.type(inputSearch, 'y');
      userEvent.click(radioFirstLetter);
      userEvent.click(buttonSearch);
    });

    await waitFor(() => {
      const recipesName = screen.getAllByTestId(/card-name/i);
      expect(recipesName.length).toEqual(2);
    });
  });

  it('Verifica se ao digitar duas letras e pesquisar com first letter se o alerta aparece na tela', async () => {
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const initialEntries = ['/drinks'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <Drinks />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/drinks');
    const buttonIconSearch = screen.getByTestId(SEARCH_TOP_BTN);
    act(() => {
      userEvent.click(buttonIconSearch);
    });
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioFirstLetter = screen.getByRole('radio', { name: /first letter/i });
    const buttonSearch = screen.getByTestId(DATA_TESTID_BUTTON_SEARCH);

    act(() => {
      userEvent.type(inputSearch, 'ye');
      userEvent.click(radioFirstLetter);
      userEvent.click(buttonSearch);
    });
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith('Your search must have only 1 (one) character');
  });

  it('Verifica se ao realizar uma pesquisa inexistente, retorna o alerta de erro', async () => {
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        drinks: null,
      }),
    });

    const initialEntries = ['/drinks'];
    await act(async () => {
      renderWithRouter(
        <SearchProvider>
          <Drinks />
        </SearchProvider>,
        { initialEntries },
      );
    });
    const buttonIconSearch = screen.getByTestId(SEARCH_TOP_BTN);
    await act(async () => {
      userEvent.click(buttonIconSearch);
    });
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioName = screen.getByRole('radio', { name: /name/i });
    const buttonSearch = screen.getByTestId(DATA_TESTID_BUTTON_SEARCH);

    await act(async () => {
      userEvent.type(inputSearch, 'xablau');
      userEvent.click(radioName);
      userEvent.click(buttonSearch);
    });

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith('Sorry, we haven\'t found any recipes for these filters.');
  });

  it('Verifica se ao realizar uma pesquisa por name na rota "/meals", e essa lista contem apenas uma receita, se é redirecionado para a página de detalhes desse receita', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(OneRecipeArrabiata),
    });
    const initialEntries = ['/meals'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <Meals />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/meals');
    const buttonIconSearch = screen.getByTestId(SEARCH_TOP_BTN);
    act(() => {
      userEvent.click(buttonIconSearch);
    });
    const inputSearch = screen.getByTestId(SEARCH_INPUT);
    const radioName = screen.getByRole('radio', { name: /name/i });
    const buttonSearch = screen.getByTestId('exec-search-btn');

    act(() => {
      userEvent.type(inputSearch, 'arrabiata');
      userEvent.click(radioName);
      userEvent.click(buttonSearch);
    });
    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals/52771');
    });
  });
});
