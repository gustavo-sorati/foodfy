const { findByChefId } = require('../models/Recipe');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const path = require('path');

module.exports = {
  async search(req, res) {
    try {
      let { filter } = req.query;

      if (!filter) return res.redirect('/recipes');

      let results = await Recipe.search(filter);

      
      const recipesPromisse = results.rows.map(async (recipe) => {
        recipe.chef_name = await (await Chef.findById(recipe.chef_id)).rows[0]
        .name;
        
        return recipe;
      });
      
      const recipes = await Promise.all(recipesPromisse);

      if(recipes.length === 0) return res.redirect('/recipes');

      let search = {
        filter,
      };

      return res.render(`public/recipes/index`, { recipes, search });
    } catch (err) {
      console.log(err);
    }
  },
};
