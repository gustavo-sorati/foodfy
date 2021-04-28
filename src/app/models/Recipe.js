const db = require('../../db/index');

module.exports = {
  async findAll() {
    const results = await db.query(`
      SELECT recipes.*, chefs.name as chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    `);

    return results.rows;
  },
  search(filter) {
    let query = `SELECT * FROM recipes WHERE title ILIKE '%${filter}%'`;

    return db.query(query);
  },
  async findById(id) {
    const results = await db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE recipes.id = $1
    `, [id]);

    return results.rows[0]

  },

  findByChefId(id) {
    let query = `SELECT * FROM recipes WHERE chef_id = $1`;

    return db.query(query, [id]);
  },

  findById2(id) {
    let query = `SELECT recipes.*, chefs.id as id_chef, chefs.name FROM recipes, chefs WHERE recipes.id = $1 AND recipes.chef_id = chefs.id`;

    return db.query(query, [id]);
  },
  // save ok
  async save(chef_id, title, ingredients, preparations, informations) {
    let query = `INSERT INTO recipes (
      chef_id,
      title,
      ingredients,
      preparation,
      information
    ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id`;

    let values = [
      chef_id,
      title,
      ingredients,
      preparations,
      informations
    ];

    const results = await db.query(query, values);

    return results.rows[0].id;
  },
  async update(data, id) {
    let query = `UPDATE recipes SET
      title = $1,
      ingredients = $2,
      preparation = $3,
      information = $4
    WHERE id = $5`;

    let values = [
      data.title,
      data.ingredients,
      data.preparations,
      data.informations,
      id,
    ];

    const results = await db.query(query, values);

    return results.rows;
  },
  async file(id) {
    const results = await db.query(`
      SELECT files.*, recipe_id, file_id
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1
    `, [id]);

    return results.rows;
  },
  // files ok
  async files(id) {
    const results = await db.query(
      `
      SELECT files.*, file_id
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1
      `, [id])

    return results.rows;
  }
};
