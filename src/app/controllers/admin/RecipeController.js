const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');
const RecipeFile = require('../../models/RecipeFile');

module.exports = {
  async index(req, res) {
    try {
      const recipes = await Recipe.findAll();

      async function getImages(id) {
        let files = await Recipe.files(id);

        files = files.map(async file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path}`.replace("public", "")
        }));

        return files;
      }

      const recipesPromise = recipes.map(async (recipe, index) => {
        const filesPromise = await getImages(recipe.id);

        const files = await Promise.all(filesPromise)

        files.length !== 0
        ? recipe.image = files[0].src
        : recipe.image = 'http://placehold.it/940x280?text=Receita sem foto';

        return recipe;
      });

      const allRecipes = await Promise.all(recipesPromise);

      res.render('admin/recipes/index.njk', { recipes });
    } catch (err) {
      console.log(err)
    }
  },
  async create(req, res) {
    const chefs = await Chef.findAll();

    res.render('admin/recipes/create.njk', { chefs });
  },
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

    res.render('admin/recipes/show.njk', { recipe });
  },
  async edit(req, res) {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    const chefs = await Chef.findAll();

    let files = await Recipe.file(recipe.id);
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path}`.replace('public', '')
    }))

    recipe.images = files;

    res.render('admin/recipes/edit.njk', { recipe, chefs });
  },
  async put(req, res) {
    const { id } = req.body;
    const { removed_files } = req.body;
    let files = req.files;

    if(removed_files){
      const imagesToRemove = removed_files.split(',');

      await imagesToRemove.forEach(async (id) => {
        await File.remove(id);
      })
    }

    if(files){
      const filesPromise = files.map(async file => {
        const file_id = await File.save({
          filename: file.filename,
          path: file.path
        });

        await RecipeFile.save({
          file_id,
          recipe_id: id
        });

      });
      files = await Promise.all(filesPromise);
    }

    await Recipe.update(req.body, id);

    return res.redirect(`/admin/recipes/${id}`);
  },
};
