import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import Meals from '../pages/Meals';
import SearchProvider from '../contexts/SearchContext/SearchProvider';

describe('Testando o componente Header', () => {
  it('Verifica se os elementos aparecem corretamente na tela', () => {
    renderWithRouter(
      <SearchProvider>
        <Meals />
      </SearchProvider>,
    );
    const profileButton = screen.getByTestId('profile-top-btn');
    const title = screen.getByTestId('page-title');
    const searchButton = screen.getByTestId('search-top-btn');
    expect(profileButton).toBeInTheDocument();
    expect(title).toHaveTextContent('Meals');
    expect(searchButton).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botão de Profile ele direciona para a página de Profile', () => {
    const { history } = renderWithRouter(
      <SearchProvider>
        <Meals />
      </SearchProvider>,
    );
    const profileButton = screen.getByTestId('profile-top-btn');

    act(() => {
      userEvent.click(profileButton);
    });
    expect(history.location.pathname).toBe('/profile');
  });

  it('Verifica se ao clicar no botão de Search ele abre o campo de busca', () => {
    renderWithRouter(
      <SearchProvider>
        <Meals />
      </SearchProvider>,
    );
    const searchButton = screen.getByTestId('search-top-btn');
    act(() => {
      userEvent.click(searchButton);
    });
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    act(() => {
      userEvent.click(searchButton);
    });
    expect(screen.queryByTestId('search-input')).toBe(null);
  });
});
