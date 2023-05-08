import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RecipeInProgress from './components/RecipeInProgress';
import Drinks from './pages/Drinks';
import Login from './pages/Login';
import Meals from './pages/Meals';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import Profile from './pages/Profile';
import MealsDetails from './pages/MealsDetails';
import DrinksDetails from './pages/DrinksDetails';

// CRIANDO A PÀGINA DE FAVORITOS

function App() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/meals" component={ Meals } />
        <Route exact path="/drinks" component={ Drinks } />
        <Route exact path="/meals/:idMeals" component={ MealsDetails } />
        <Route exact path="/drinks/:iDrinks" component={ DrinksDetails } />
        <Route
          exact
          path="/meals/:id-da-receita/in-progress"
          component={ RecipeInProgress }
        />
        <Route
          exact
          path="/drinks/:id-da-receita/in-progress"
          component={ RecipeInProgress }
        />
        <Route exact path="/done-recipes" component={ DoneRecipes } />
        <Route exact path="/favorite-recipes" component={ FavoriteRecipes } />
        <Route exact path="/profile" component={ Profile } />
      </Switch>
    </main>
  );
}

export default App;
