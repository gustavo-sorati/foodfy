const db = require('../../db/index');

module.exports = {
  async findAll() {
    return db.query(`SELECT * FROM recipes`);
  },
  search(filter) {
    let query = `SELECT * FROM recipes WHERE title ILIKE '%${filter}%'`;

    return db.query(query);
  },
  findById(id) {
    let query = `SELECT * FROM recipes WHERE id = $1`;

    return db.query(query, [id]);
  },
  findByChefId(id) {
    let query = `SELECT * FROM recipes WHERE chef_id = $1`;

    return db.query(query, [id]);
  },
  findById2(id) {
    let query = `SELECT recipes.*, chefs.id as id_chef, chefs.name FROM recipes, chefs WHERE recipes.id = $1 AND recipes.chef_id = chefs.id`;

    return db.query(query, [id]);
  },

  async create(data) {
    let query = `INSERT INTO recipes (
            image,
            title,
            ingredients,
            preparation,
            information
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id`;

    let values = [
      data.image,
      data.title,
      data.ingredients,
      data.preparations,
      data.informations,
    ];

    return db.query(query, values);
  },
  async update(data, id) {
    let query = `UPDATE recipes SET 
      image = $1,
      title = $2,
      ingredients = $3,
      preparation = $4,
      information = $5
    WHERE id = $6`;

    let values = [
      data.image,
      data.title,
      data.ingredients,
      data.preparations,
      data.informations,
      id,
    ];

    return db.query(query, values);
  },
};
