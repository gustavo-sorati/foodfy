const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');
const RecipeFile = require('../../models/RecipeFile');

module.exports = {
  async index(req, res) {
    let chefs = await Chef.findAll();

    const chefsPromise = chefs.map(async chef => {
      const file = await File.findOne({ where : { id: chef.id }});
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

    console.log(chefs)
    return res.render('admin/chefs/index.njk', { chefs });
  },
  async show(req, res) {
    try {
      const { id } = req.params;

      const chef = await Chef.find(id);
      chef.file = await File.findOne({where: {id: chef.file_id}});
      chef.file.src = `${req.protocol}://${req.headers.host}${chef.file.path}`.replace('public', '');

      async function getImages(recipe_id) {
        let files = await Recipe.file(recipe_id);
        console.log(files)
        // files = files.map(file => ({
        //   ...files,
        //   src : `${req.protocol}://${req.headers.host}${file.path}`.replace('public', '')
        // }));


        return files;
      }

      const recipes = await Chef.findRecipes(chef.id);
      const recipesPromise = recipes.map(async recipe => {
        const files = await getImages(recipe.id);
        recipe.image = files;
        return recipe
      })
      chef.recipes = await Promise.all(recipesPromise)

      // console.log(chef)





















      return res.render('admin/chefs/show.njk', { chef });
    } catch(err) {
      console.log('Erro no admin show' + err)
    }
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
    try {
      const data = req.body;

      if(data === '') return res.send('Porfavor preencha todos os campos');
      if(req.files.length === 0) return res.send('Porfavor envie sua foto');

      // console.log(req.files[0])
      // Salvar Imagem
      const file = await File.save(req.files[0].filename, req.files[0].path);
      const file_id = file.rows[0].id;


      const  response = await Chef.save(data, file_id);
      const id = response.rows[0].id;


      return res.redirect(`/admin/chefs/${id}`);
    } catch (err) {
      console.log('Erro no Post' + err);
    }
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


//show






      // let chef = await Chef.findById(id);
      // chef = chef.rows[0];

      // let image = await File.FindById(chef.file_id);
      // image = image.rows[0];

      // let recipes = await Recipe.findByChefId(chef.id);
      // // recipes = recipes.rows;

      // //pega todos os file_id
      // let recipesReferenceFilesPromise = recipes.rows.map(async(recipe) => {
      //   return await RecipeFile.findByRecipeId(recipe.id);
      // });
      // let x = await Promise.all(recipesReferenceFilesPromise);
      // // recipes.file_id = recipes.file_id.rows

      // console.log(x)

      // getRecipeImages
      // let x = recipes.rows.map(async(recipe) => {
      //   const image = await Recipe.teste(recipe.id);
      //   return {
      //     image
      //   }
      // })
      // const z = await Promise.all(x)


      // console.log(z.rows)






      // let recipe_images = await Recipe.files(recipes.id)



      // chef = {
      //   ...chef,
      //   image: {
      //     ...image,
      //     src: `${req.protocol}://${req.headers.host}${image.path}`.replace("public", '')
      //   },
      //   // recipes: [
      //   //   {
      //   //   ...recipes,
      //   //   ingredients: recipes.ingredients
      //   //   }
      //   // ]
      // }

      // console.log(chef)
