const db = require('../../db');

module.exports = {
  async find(id) {
    const results = await db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`, [id]);

    return results.rows[0];
  },
  async findImage(file_id){
    const results = await db.query(`
      SELECT files.*
      from files
      where files.id = $1
    `, [file_id]);

    return results.rows
  },
  // findAll ok
  async findAll() {
    const results = await db.query(`
      SELECT chefs.*, count(recipes) as total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY updated_at ASC
    `);

    return results.rows;
  },
  async findRecipes(chef_id){
    const results = await db.query(`
      SELECT recipes.*
      FROM recipes
      WHERE recipes.chef_id = $1
    `, [chef_id]);

    return results.rows;
  },
  findById(id) {
    let query = 'SELECT * FROM chefs WHERE id = $1';

    return db.query(query, [id]);
  },
  async save(data, id) {
    let query = `
      INSERT INTO chefs (
          name,
          file_id
      ) VALUES ($1, $2) RETURNING ID`;

    let values = [data.name, id];

    let results = await db.query(query, values);

    return results.rows[0].id;
  },
  update(data, id) {
    let query = `UPDATE chefs SET
        name = $1,
        avatar_url = $2
      WHERE id = $3`;

    return db.query(query, [data.name, data.avatar_url, id], (err, results) => {
      if (err) throw new Error(err.message);
    });
  },
  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
  },
};
