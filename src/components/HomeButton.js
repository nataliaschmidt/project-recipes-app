import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import '../styles/HomeButton.css';

export default function HomeButton() {
  const history = useHistory();
  return (
    <button
      className="home-button"
      onClick={ () => history.push('/meals') }
    >
      <AiOutlineHome className="share-icon" />
    </button>
  );
}
