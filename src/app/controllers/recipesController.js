const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

module.exports = {
  async index(req, res) {
    let recipes = await Recipe.findAll();

    // console.log(recipes.rows);
    res.render('admin/recipes/index.njk', { recipes: recipes.rows });
  },
  async show(req, res) {
    const { id } = req.params;

    let recipe = await Recipe.findById(id);

    res.render('admin/recipes/show.njk', { recipe: recipe.rows[0] });
  },
  async create(req, res) {
    let results = await Chef.findAll();

    res.render('admin/recipes/create.njk', { chefs: results.rows });
  },
  async edit(req, res) {
    const { id } = req.params;

    let results = await Recipe.findById(id);
    let recipe = results.rows[0];

    results = await Chef.findAll();
    let chefs = results.rows;

    res.render('admin/recipes/edit.njk', { recipe, chefs });
  },
  async post(req, res) {
    // console.log(req.body);

    let recipe = await Recipe.create(req.body);

    return res.redirect(`/admin/recipes/${recipe.rows[0].id}`);
  },
  async put(req, res) {
    const { id } = req.body;

    let results = await Recipe.update(req.body, id);

    return res.redirect(`/admin/recipes/${id}`);
  },
};
