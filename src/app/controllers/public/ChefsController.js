const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');

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
    console.log(chefs)
    return res.render('public/chefs/index.njk', { chefs });
  },
};
