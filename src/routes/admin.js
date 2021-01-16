const express = require('express');
const routes = express.Router();

const RecipeController = require('../app/controllers/admin/RecipeController');
const ChefController = require('../app/controllers/admin/ChefController');

// RECIPES

routes.get('/recipes', RecipeController.index);
routes.get('/recipes/create', RecipeController.create);
routes.get('/recipes/:id', RecipeController.show);
routes.get('/recipes/:id/edit', RecipeController.edit);

routes.post('/recipes', RecipeController.post);
routes.put('/recipes', RecipeController.put);
// // routes.delete('/recipes', recipes.delete);

// CHEFS
routes.get('/chefs', ChefController.index);
routes.get('/chefs/create', ChefController.create);
routes.get('/chefs/:id', ChefController.show);
routes.get('/chefs/:id/edit', ChefController.edit);

routes.post('/chefs', ChefController.post);
routes.put('/chefs', ChefController.put);
routes.delete('/chefs', ChefController.delete);

module.exports = routes;
