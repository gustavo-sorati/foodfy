const express = require('express');
const SearchController = require('../app/controllers/SearchController');
const Recipe = require('../app/models/Recipe');
const data = require('../data.json');

const RecipeController = require('../app/controllers/public/RecipesController');

const routes = express.Router();

routes.get('/', RecipeController.index);

routes.get('/about', (req, res) => {
  res.render('common/about.njk');
});

routes.get('/', (req, res) => {
  res.render('common/home.njk', { recipes: data.recipes });
});

routes.get('/recipes', async (req, res) => {
  let results = await Recipe.findAll();
  let recipes = results.rows;

  res.render('common/recipes/index.njk', { recipes });
});

routes.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  let response = await Recipe.findById2(id);
  let recipe = response.rows[0];

  res.render('common/recipes/show.njk', { recipe });
});

routes.get('/search', SearchController.search);

module.exports = routes;
