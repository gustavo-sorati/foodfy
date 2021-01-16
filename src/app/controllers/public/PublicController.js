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

      res.render('public/home.njk', { recipes });
    } catch (err) {
      console.log(err);
    }
  },
  about(req, res) {
    res.render('public/about.njk');
  },
};
