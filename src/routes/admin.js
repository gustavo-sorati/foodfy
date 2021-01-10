const express = require('express');
const routes = express.Router();

const recipesController = require('../app/controllers/recipesController');
const chefsController = require('../app/controllers/chefsController');

// RECIPES

routes.get('/recipes', recipesController.index);
routes.get('/recipes/create', recipesController.create);
routes.get('/recipes/:id', recipesController.show);
routes.get('/recipes/:id/edit', recipesController.edit);

routes.post('/recipes', recipesController.post);
routes.put('/recipes', recipesController.put);
// // routes.delete('/recipes', recipes.delete);

// CHEFS
routes.get('/chefs', chefsController.index);
routes.get('/chefs/create', chefsController.create);
routes.get('/chefs/:id', chefsController.show);
routes.get('/chefs/:id/edit', chefsController.edit);

routes.post('/chefs', chefsController.post);
routes.put('/chefs', chefsController.put);
routes.delete('/chefs', chefsController.delete);

module.exports = routes;
