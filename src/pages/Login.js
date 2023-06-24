/* eslint-disable react/jsx-max-depth */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/Login.css';

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
    <div className="container-login">
      <div className="container-form">
        <form>

          <div className="field">
            <p className="control has-icons-left">
              <input
                placeholder="Email"
                className="input"
                type="email"
                data-testid="email-input"
                name="email"
                value={ email }
                onChange={ ({ target }) => setEmail(target.value) }
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope" />
              </span>
            </p>
          </div>

          <div className="field">
            <p className="control has-icons-left">
              <input
                placeholder="Password"
                className="input"
                type="password"
                data-testid="password-input"
                name="password"
                value={ password }
                onChange={ ({ target }) => setPassword(target.value) }
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock" />
              </span>
            </p>
          </div>
          {
            isDisabled && (
              <span
                className="messagem-password"
              >
                Your password must be 7 characters

              </span>
            )
          }
          <button
            data-testid="login-submit-btn"
            type="button"
            className="login-btn"
            disabled={ isDisabled }
            onClick={ handleClick }
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
