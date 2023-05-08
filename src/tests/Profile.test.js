import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from './helpers/renderWith';
import Profile from '../pages/Profile';

describe('Testando a pagina Profile', () => {
  it('Verifica se os elementos aparecem corretamente na tela', () => {
    renderWithRouter(
      <Profile />,
    );
    const profileEmail = screen.getByTestId('profile-email');
    const doneRecipesBtn = screen.getByTestId('profile-done-recipes');
    const favoritesBtn = screen.getByTestId('profile-favorite-btn');
    const logoutBtn = screen.getByTestId('profile-logout-btn');

    expect(profileEmail).toBeInTheDocument();
    expect(doneRecipesBtn).toBeInTheDocument();
    expect(favoritesBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });
});
