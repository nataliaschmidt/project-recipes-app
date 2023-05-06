import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import Meals from '../pages/Meals';
import { renderWithRouter } from './helpers/renderWith';
import SearchProvider from '../contexts/SearchContext/SearchProvider';

describe('Testando a página de Login', () => {
  it('verifica se ao clicar botão de drinks, vai para a rota drinks e se clicar no botão de mels vai para a rota meals', () => {
    const initialEntries = ['/meals'];
    const { history } = renderWithRouter(
      <SearchProvider>
        <Meals />
      </SearchProvider>,
      { initialEntries },
    );
    expect(history.location.pathname).toBe('/meals');
    const buttonFooterDrink = screen.getByTestId('drinks-bottom-btn');
    userEvent.click(buttonFooterDrink);
    expect(history.location.pathname).toBe('/drinks');

    const buttonFooterMeals = screen.getByTestId('meals-bottom-btn');
    userEvent.click(buttonFooterMeals);
    expect(history.location.pathname).toBe('/meals');
  });
});
