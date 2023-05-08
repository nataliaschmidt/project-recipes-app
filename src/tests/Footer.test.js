import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './helpers/renderWith';
import Footer from '../components/Footer';

describe('Testando a página de Login', () => {
  it('verifica se ao clicar botão de drinks, vai para a rota drinks e se ao clicar no botão de meals vai para a rota meals', () => {
    const { history } = renderWithRouter(<Footer />);
    const buttonDrink = screen.getByTestId('drinks-bottom-btn');
    userEvent.click(buttonDrink);
    expect(history.location.pathname).toBe('/drinks');

    const buttonMeals = screen.getByTestId('meals-bottom-btn');
    userEvent.click(buttonMeals);
    expect(history.location.pathname).toBe('/meals');
  });
});
