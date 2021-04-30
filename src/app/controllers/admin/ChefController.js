const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');
const RecipeFile = require('../../models/RecipeFile');
const { file } = require('../../models/Recipe');

module.exports = {
  async index(req, res) {
    let chefs = await Chef.findAll();

    const chefsPromise = chefs.map(async chef => {
      const file = await File.findOne({ where : { id: chef.file_id }});
      let src = '';

      if(file) {
        file.src = `${req.protocol}://${req.headers.host}${file.path}`.replace("public", '');
      } else {
        src = 'http://placehold.it/940x280?text=Receita sem foto'
      }

      return {
        ...chef,
        image: file || { src }
      }
    });
    chefs = await Promise.all(chefsPromise);

    return res.render('admin/chefs/index.njk', { chefs });
  },
  async show(req, res) {
    try {
      const { id } = req.params;
      console.log(id)
      const chef = await Chef.find(id);
      chef.image = await File.findOne({ where : { id: chef.file_id }});
      chef.image.src = `${req.protocol}://${req.headers.host}${chef.image.path}`.replace('public', '')
      async function getImages(recipe_id){
        let files = await Recipe.files(recipe_id);

        files = files.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path}`.replace('public', '')
        }))

        return files;
      }

      const recipes = await Recipe.findAllByChefId(chef.id);
      const recipesPromise = recipes.map(async recipe => {
        const files = await getImages(recipe.id);
        recipe.image = files[0].src

        return recipe;
      })
      chef.recipes = await Promise.all(recipesPromise);

      console.log(chef)
      return res.render('admin/chefs/show.njk', { chef });
    } catch(err) {
      console.log('Erro no admin show' + err)
    }
  },
  create(req, res) {
    return res.render('admin/chefs/create.njk');
  },
  async post(req, res) {
    try {
      const data = req.body;

      if(data === '') return res.send('Porfavor preencha todos os campos');
      if(req.files.length === 0) return res.send('Porfavor envie sua foto');

      const file = await File.save( req.files[0].filename, req.files[0].path );

      const chef_id = await Chef.save(data, file.id);

      return res.redirect(`/admin/chefs/${chef_id}`);
    } catch (err) {
      console.log('Erro no Post' + err);
    }
  },
  async edit(req, res) {
    let { id } = req.params;

    let chef = await Chef.findById(id);

    if (!chef) return res.send('Chef not found!!!');

    // console.log(chef.rows[0]);
    return res.render(`admin/chefs/edit.njk`, { chef: chef.rows[0] });
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

    // console.log(chefHasRecipe);
    if (chefHasRecipe.length)
      return res.send('Exclua as receitas do chefe primeiro');

    await Chef.delete(chef_id);

    return res.redirect('/admin/chefs');
  },
};
