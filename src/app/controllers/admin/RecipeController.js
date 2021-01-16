const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');

module.exports = {
  async index(req, res) {
    let results = await Recipe.findAll();

    let recipePromisse = results.rows.map(async (recipe) => {
      recipe.chef_name = (await Chef.findById(recipe.chef_id)).rows[0].name;
      return recipe;
    });

    let recipes = await Promise.all(recipePromisse);

    res.render('admin/recipes/index.njk', { recipes });
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Recipe.findById(id);
    let recipe = results.rows[0];

    recipe.chef_name = (await Chef.findById(recipe.chef_id)).rows[0].name;

    res.render('admin/recipes/show.njk', { recipe });
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
    let recipe = await Recipe.create(req.body);

    return res.redirect(`/admin/recipes/${recipe.rows[0].id}`);
  },
  async put(req, res) {
    const { id } = req.body;

    let results = await Recipe.update(req.body, id);

    return res.redirect(`/admin/recipes/${id}`);
  },
};
