import React from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Profile() {
  const history = useHistory();
  const { email } = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    history.push('/');
    localStorage.clear();
  };
  return (
    <>
      <Header
        title="Profile"
        searchIcon={ false }
      />
      <p
        data-testid="profile-email"
      >
        { email }
      </p>
      <button
        data-testid="profile-done-btn"
        onClick={ () => history.push('/done-recipes') }
      >
        Done Recipes
      </button>
      <button
        data-testid="profile-favorite-btn"
        onClick={ () => history.push('/favorite-recipes') }
      >
        Favorite Recipes
      </button>
      <button
        data-testid="profile-logout-btn"
        onClick={ handleLogout }
      >
        Logout
      </button>
      <Footer />
    </>
  );
}
