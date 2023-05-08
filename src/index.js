import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SearchProvider from './contexts/SearchContext/SearchProvider';
import './styles/index.css';
import RecipesMealsProvider from './contexts/RecipesMealsContext/RecipesMealsProvider';
import RecipesDrinksProvider from './contexts/RecipesDrinksContext/RecipesDrinksProvider';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <RecipesDrinksProvider>
      <RecipesMealsProvider>
        <SearchProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SearchProvider>
      </RecipesMealsProvider>
    </RecipesDrinksProvider>,
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
