import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWith';
import Meals from '../pages/Meals';

describe('Testando o componente Header', () => {
  it('Verifica se os elementos aparevem corretamente na tela', () => {
    renderWithRouter(<Meals />);
    const profileButton = screen.getByRole('button', { name: /perfil icon/i });
    const title = screen.getByTestId('page-title');
    const searchButton = screen.getByRole('button', { name: /search icon/i });
    expect(profileButton).toBeInTheDocument();
    expect(title).toHaveTextContent('Meals');
    expect(searchButton).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botão de Profile ele direciona para a página de Profile', () => {
    const { history } = renderWithRouter(<Meals />);
    const profileButton = screen.getByRole('button', { name: /perfil icon/i });

    act(() => {
      userEvent.click(profileButton);
    });
    expect(history.location.pathname).toBe('/profile');
  });

  it('Verifica se ao clicar no botão de Search ele abre o campo de busca', () => {
    const { history } = renderWithRouter(<Meals />);
    const searchButton = screen.getByRole('button', { name: /search icon/i });
    act(() => {
      userEvent.click(searchButton)
    })
    expect(screen.getByText(/search:/i)).toBeInTheDocument();
    act(() => {
      userEvent.click(searchButton)
    })
    expect(screen.queryByText(/search:/i)).toBe(null);
  });
});
