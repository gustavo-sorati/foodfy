const express = require('express');
const SearchController = require('../app/controllers/SearchController');
const Recipe = require('../app/models/Recipe');

const RecipeController = require('../app/controllers/public/RecipesController');

const routes = express.Router();

routes.get('/', RecipeController.index);

routes.get('/about', (req, res) => {
  res.render('public/about.njk');
});

routes.get('/recipes', RecipeController.recipesAll);

routes.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  let response = await Recipe.findById2(id);
  let recipe = response.rows[0];

  res.render('common/recipes/show.njk', { recipe });
});

routes.get('/search', SearchController.search);

module.exports = routes;
