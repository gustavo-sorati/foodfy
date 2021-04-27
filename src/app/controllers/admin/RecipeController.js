const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');
const RecipeFile = require('../../models/RecipeFile');

module.exports = {
  async index(req, res) {
    let recipes = await Recipe.findAll();

    // get id Images
    async function getImages(recipe_id){
      return await Recipe.files(recipe_id);
    }

    let recipePromisse = recipes.rows.map(async (recipe) => {
      recipe.chef_name = (await Chef.findById(recipe.chef_id)).rows[0].name;

      recipe.file = (await getImages(recipe.id)).rows[0];
      recipe.src = `${req.protocol}://${req.headers.host}${recipe.file.path}`.replace("public", "");

      return recipe;
    });

    recipes = await Promise.all(recipePromisse);

    res.render('admin/recipes/index.njk', { recipes });
  },
  // create ok
  async create(req, res) {
    const chefs = await Chef.findAll();

    res.render('admin/recipes/create.njk', { chefs });
  },
  async edit(req, res) {
    const { id } = req.params;

    let results = await Recipe.findById(id);
    let recipe = results.rows[0];

    results = await Chef.findAll();
    let chefs = results.rows;

    const files = await RecipeFile.findByRecipeId(recipe.id);

    const filesPromise = files.map(async(file) => {
      return await File.FindById(file.file_id);

    });

    let images = await Promise.all(filesPromise);

    images = images.map(image => {
      let src = `${req.protocol}://${req.headers.host}${image.path}`.replace('public', '');

      return {
        ...image,
        src
      }

    })

    res.render('admin/recipes/edit.njk', { recipe, chefs, images });
  },
  // post ok
  async post(req, res) {
    try {
      if(req.files.length === 0) return res.send('Por favor envie ao menos uma imagem da receita');

      const { chef_id, title, ingredients, preparations, informations } = req.body;
      const recipe_id = await Recipe.save(chef_id, title, ingredients, preparations, informations);

      const filesPromise = req.files.map(async file => {
        const file_id = await File.save({
          filename: file.filename,
          path: file.path
        });

        await RecipeFile.save({
          file_id,
          recipe_id
        });
      });
      await Promise.all(filesPromise);

      return res.redirect(`/admin/recipes/${recipe_id}`);
    } catch (err) {
      console.log(err)
    }
  },
  async show(req, res) {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    recipe.files = await Recipe.files(recipe.id);
    recipe.files = recipe.files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path}`.replace('public', '')
    }))

    console.log(recipe)
    res.render('admin/recipes/show.njk', { recipe });
  },
  async put(req, res) {
    const { id } = req.body;
    const { removed_files } = req.body;

    if(removed_files){
      const imagesToRemove = removed_files.split(',');

      imagesToRemove.forEach(async (id) => {
        await RecipeFile.removeByFileId(id);
        await File.removeByFileId(id);
      })
    }

    let results = await Recipe.update(req.body, id);

    return res.redirect(`/admin/recipes/${id}`);
  },
};
