const db = require('../../db/index');

module.exports = {
  async findAllByChefId(chef_id){
    const results = await db.query(`
      SELECT recipes.*
      from recipes
      WHERE recipes.chef_id = $1
    `, [chef_id]);

    return results.rows;
  },
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
      chef_id = $2,
      ingredients = $3,
      preparation = $4,
      information = $5
    WHERE id = $6`;

    let values = [
      data.title,
      data.chef_id,
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
  },
  async delete(id){
    await db.query(`
      DELETE FROM recipes
      WHERE id = $1
    `, [id]);
  }
};
