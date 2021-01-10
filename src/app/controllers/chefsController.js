const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

module.exports = {
  async index(req, res) {
    let chefs = await Chef.findAll();

    return res.render('admin/chefs/index.njk', { chefs: chefs.rows });
  },
  async show(req, res) {
    const { id } = req.params;

    let chef = await Chef.findById(id);
    let chefRecipes = await Recipe.findByChefId(id);

    // console.log(chefRecipes.rows);
    if (!chef) return res.send('Chef not found!!!');
    // if (!chefRecipes) chefRecipes = null;

    return res.render('admin/chefs/show.njk', {
      chef: chef.rows[0],
      recipes: chefRecipes.rows,
    });
  },
  create(req, res) {
    return res.render('chefs/create.njk');
  },
  async edit(req, res) {
    let { id } = req.params;

    let chef = await Chef.findById(id);

    if (!chef) return res.send('Chef not found!!!');

    // console.log(chef.rows[0]);
    return res.render(`admin/chefs/edit.njk`, { chef: chef.rows[0] });
  },
  // --------------------------------------------
  async post(req, res) {
    const data = req.body;

    let response = await Chef.create(data);

    return res.redirect(`/admin/chefs/${response}`);
  },
  async put(req, res) {
    const { id } = req.body;

    try {
      let response = await Chef.update(req.body, id);

      return res.redirect(`admin/chefs/${id}`);
    } catch (err) {
      console.log(err);
    }
  },
  async delete(req, res) {
    let { chef_id } = req.body;

    // console.log(chef_id);
    let results = await Recipe.findByChefId(chef_id);
    let chefHasRecipe = results.rows;

    console.log(chefHasRecipe);
    if (chefHasRecipe.length)
      return res.send('Exclua as receitas do chefe primeiro');

    await Chef.delete(chef_id);

    return res.redirect('/admin/chefs');
  },
};
