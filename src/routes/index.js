const express = require('express');
const routes = express.Router();
// const Recipe = require('../app/models/Recipe');

const admin = require('./admin');
const public = require('./public');

// use external routes
routes.use('/admin', admin);
routes.use('/', public);

// common routes
routes.get('/', (req, res) => {
  res.render('common/home.njk', { recipes: data.recipes });
});

// routes.get('/about', (req, res) => {
//   res.render('common/about.njk');
// });

// routes.get('/recipes', async (req, res) => {
//   let results = await Recipe.findAll();
//   let recipes = results.rows;

//   res.render('common/recipes/index.njk', { recipes });
// });

// routes.get('/recipes/:id', async (req, res) => {
//   const { id } = req.params;

//   let response = await Recipe.findById2(id);
//   let recipe = response.rows[0];

//   res.render('common/recipes/show.njk', { recipe });
// });

module.exports = routes;
