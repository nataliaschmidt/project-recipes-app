import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Login from '../pages/Login';
import { renderWithRouter } from './helpers/renderWith';

describe('Testando a página de Login', () => {
  it('Verifica se renderiza o caminho correto da página de Login', () => {
    const { history } = renderWithRouter(<Login />);
    expect(history.location.pathname).toBe('/');
  });

  it('Verifica se a página está renderizando corretamente', () => {
    renderWithRouter(<Login />);
    const inputEmail = screen.getByRole('textbox', { name: /email:/i });
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = screen.getByLabelText(/password:/i);
    expect(inputPassword).toBeInTheDocument();

    const buttonEnter = screen.getByRole('button', { name: /enter/i });
    expect(buttonEnter).toBeInTheDocument();
  });

  it('Verifica a funcionalidade da página de Login', () => {
    const { history } = renderWithRouter(<Login />);
    const inputEmail = screen.getByRole('textbox', { name: /email:/i });
    const inputPassword = screen.getByLabelText(/password:/i);
    const buttonEnter = screen.getByRole('button', { name: /enter/i });

    expect(buttonEnter).toBeDisabled();
    act(() => {
      userEvent.type(inputEmail, 'teste@teste.com');
      userEvent.type(inputPassword, '1234567');
    });
    expect(buttonEnter).toBeEnabled();
    userEvent.click(buttonEnter);
    expect(history.location.pathname).toBe('/meals');
  });
});
