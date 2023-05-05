import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const MAGIC_NUMBER_PASSWORD = 6;

    const regexEmail = /[\w_.-]+@\w+(\.\w{2,3}){1,2}/g;
    const checkEmail = regexEmail.test(email);
    const verifyPassoword = password.length > MAGIC_NUMBER_PASSWORD;

    if (checkEmail && verifyPassoword) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email, password]);

  const handleClick = () => {
    // salvar no localstorage o email.
    // redirecionar o usuário para a tela de receitas.
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/meals');
  };

  return (
    <form>
      <label htmlFor="email">
        Email:
        <input
          data-testid="email-input"
          type="email"
          name="email"
          id="email"
          value={ email }
          onChange={ ({ target }) => setEmail(target.value) }
        />
      </label>
      <label htmlFor="password">
        Password:
        <input
          data-testid="password-input"
          type="password"
          name="password"
          id="password"
          value={ password }
          onChange={ ({ target }) => setPassword(target.value) }
        />
      </label>

      <button
        data-testid="login-submit-btn"
        type="button"
        disabled={ isDisabled }
        onClick={ handleClick }
      >
        Enter
      </button>
    </form>
  );
}
