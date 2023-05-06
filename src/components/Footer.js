import React from 'react';
import { useHistory } from 'react-router-dom';
import DrinkIcon from '../images/drinkIcon.svg';
import MealIcon from '../images/mealIcon.svg';
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
          <img
            data-testid="drinks-bottom-btn"
            src={ DrinkIcon }
            alt="Perfil icon"
          />
        </button>

        <button
          onClick={ () => history.push('/meals') }
        >
          <img
            data-testid="meals-bottom-btn"
            src={ MealIcon }
            alt="Search icon"
          />
        </button>

      </nav>
    </footer>
  );
}
