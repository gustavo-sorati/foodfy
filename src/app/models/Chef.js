const db = require('../../db');

module.exports = {
  findAll() {
    return db.query('SELECT * FROM chefs');
  },
  findById(id) {
    let query = 'SELECT * FROM chefs WHERE id = $1';

    return db.query(query, [id]);
  },
  create(data) {
    let query = `INSERT INTO chefs (
        name,
        avatar_url
    ) VALUES ($1, $2) RETURNING ID`;

    let values = [data.name, data.avatar_url];

    let results = db.query(query, values);
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
