const Recipe = require('../../models/Recipe');
const Chef = require('../../models/Chef');

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipe.findAll();

      const recipePromisse = results.rows.map(async (recipe) => {
        recipe.chef_name = await (await Chef.findById(recipe.chef_id)).rows[0]
          .name;
        return recipe;
      });

      const recipes = await Promise.all(recipePromisse);

      res.render('public/recipes/index.njk', { recipes });
    } catch (err) {
      consol.log(err);
    }
  },
  async show(req, res) {
    const { id } = req.params;

    let response = await Recipe.findById2(id);
    let recipe = response.rows[0];

    res.render('public/recipes/show.njk', { recipe });
  },
};
