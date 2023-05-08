import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Profile() {
  const { email } = JSON.parse(localStorage.getItem('user'));
  console.log(email);
  return (
    <>
      <Header
        title="Profile"
        searchIcon={ false }
      />
      <p data-testid="profile-email">{ email }</p>
      <button data-testid="profile-done-btn">Done Recipes</button>
      <button data-testid="profile-favorite-btn">Favorite Recipes</button>
      <button data-testid="profile-logout-btn">Logout</button>
      <Footer />
    </>
  );
}
