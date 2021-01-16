const express = require('express');
const PublicController = require('../app/controllers/public/PublicController');
const RecipeController = require('../app/controllers/public/RecipesController');
const ChefController = require('../app/controllers/public/ChefsController');
const SearchController = require('../app/controllers/SearchController');

const routes = express.Router();

// Public
routes.get('/', PublicController.index);
routes.get('/about', PublicController.about);

// Recipes
routes.get('/recipes', RecipeController.index);
routes.get('/recipes/:id', RecipeController.show);

// Chefs
routes.get('/chefs', ChefController.index);

// Search
routes.get('/search', SearchController.search);

module.exports = routes;
