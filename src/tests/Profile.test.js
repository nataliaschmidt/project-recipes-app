import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import Profile from '../pages/Profile';

describe('Testando a pagina Profile', () => {
  it('Verifica se os elementos aparecem corretamente na tela', () => {
    renderWithRouter(
      <Profile />,
    );

    localStorage.setItem('user', JSON.stringify('login'));
    const email = JSON.parse(localStorage.getItem('user'));
    expect(email).toEqual('login');
    const profileEmail = screen.getByTestId('profile-email');
    const doneRecipesBtn = screen.getByTestId('profile-done-btn');
    const favoritesBtn = screen.getByTestId('profile-favorite-btn');
    const logoutBtn = screen.getByTestId('profile-logout-btn');

    expect(profileEmail).toBeInTheDocument();
    expect(doneRecipesBtn).toBeInTheDocument();
    expect(favoritesBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });

  it('Verifica se ao clinar no botão Done Recipes ele direciona para a página Done Recipes', () => {
    const { history } = renderWithRouter(
      <Profile />,
    );
    const doneRecipesBtn = screen.getByTestId('profile-done-btn');

    act(() => {
      userEvent.click(doneRecipesBtn);
    });
    expect(history.location.pathname).toBe('/done-recipes');
  });

  it('Verifica se ao clinar no botão Faforite Recipes ele direciona para a página Favorite Recipes', () => {
    const { history } = renderWithRouter(
      <Profile />,
    );
    const favoritesBtn = screen.getByTestId('profile-favorite-btn');

    act(() => {
      userEvent.click(favoritesBtn);
    });
    expect(history.location.pathname).toBe('/favorite-recipes');
  });

  it('Verifica se ao clinar no botão Logout ele direciona para a página Login', () => {
    const { history } = renderWithRouter(
      <Profile />,
    );
    const logoutBtn = screen.getByTestId('profile-logout-btn');

    act(() => {
      userEvent.click(logoutBtn);
    });
    expect(history.location.pathname).toBe('/');
  });
});
