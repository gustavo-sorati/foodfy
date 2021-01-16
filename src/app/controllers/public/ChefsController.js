const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');

module.exports = {
  async index(req, res) {
    let results = await Chef.findAll();

    let chefsPromisses = results.rows.map(async (chef) => {
      chef.qtdeRecipes = await (await Recipe.findByChefId(chef.id)).rowCount;
      return chef;
    });

    let chefs = await Promise.all(chefsPromisses);

    res.render('public/chefs/index.njk', { chefs });
  },
};
