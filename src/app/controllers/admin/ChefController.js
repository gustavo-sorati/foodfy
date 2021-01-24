const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');

module.exports = {
  async index(req, res) {
    let results = await Chef.findAll();
    let chefs = results.rows;

    return res.render('admin/chefs/index.njk', { chefs });
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Chef.findById(id);
    let chef = results.rows[0];

    chef.recipes = (await Recipe.findByChefId(chef.id)).rows
    
    console.log(chef)
    return res.render('admin/chefs/show.njk', { chef });
  },
  create(req, res) {
    return res.render('admin/chefs/create.njk');
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

    if(data === '') return res.send('Pleash fill all fields')

    let response = await Chef.create(data);

    return res.redirect(`/admin/chefs/${response}`);
  },
  async put(req, res) {
    const { id } = req.body;

    try {
      let response = await Chef.update(req.body, id);

      return res.redirect(`/admin/chefs/${id}`);
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
