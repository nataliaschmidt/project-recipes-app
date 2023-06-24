import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/Profile.css';

export default function Profile() {
  const history = useHistory();
  const [email, setEmail] = useState('');

  const checkEmail = () => {
    if (JSON.parse(localStorage.getItem('user') !== null)) {
      const emailLocalStorage = JSON.parse(localStorage.getItem('user'));
      setEmail(emailLocalStorage.email);
    }
  };

  useEffect(() => {
    checkEmail();
  }, []);

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
      <h2
        className="email-profile"
        data-testid="profile-email"
      >
        { `Email: ${email}` }
      </h2>

      <div className="container-buttons-profile">
        <button
          className="category-button"
          data-testid="profile-done-btn"
          onClick={ () => history.push('/done-recipes') }
        >
          Done Recipes
        </button>
        <button
          className="category-button"
          data-testid="profile-favorite-btn"
          onClick={ () => history.push('/favorite-recipes') }
        >
          Favorite Recipes
        </button>
        <button
          className="category-button"
          data-testid="profile-logout-btn"
          onClick={ handleLogout }
        >
          Logout
        </button>
      </div>
      <Footer />
    </>
  );
}
