import React from 'react';
import { useHistory } from 'react-router-dom';
import { BiDrink } from 'react-icons/bi';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import '../styles/Footer.css';

export default function Footer() {
  const history = useHistory();
  // REQUISITOS 16, 18 -> IMPLEMENTAR O FOOTER FIXO NO INFERIOR DA PÁGINA E DIRECIONAR A ROTA AO CLICAR NOS BOTÕES
  return (
    <footer data-testid="footer">
      <nav className="nav-footer">
        <button
          onClick={ () => history.push('/drinks') }
        >
          <BiDrink className="footer-icon" />
        </button>

        <button
          onClick={ () => history.push('/meals') }
        >
          <GiForkKnifeSpoon className="footer-icon" />
        </button>

      </nav>
    </footer>
  );
}
