const Recipe = require('../../models/Recipe');
const Chef = require('../../models/Chef');

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

      console.log(allRecipes)
      res.render('public/home.njk', { recipes : allRecipes });
    } catch (err) {
      console.log(err)
    }
  },
  about(req, res) {
    res.render('public/about.njk');
  },
};
