const db = require("../../db");

module.exports = {
  // save ok
  async save(file_id, recipe_id) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
    `
    const values = [
      recipe_id,
      file_id
    ];

    await db.query(query, values);
  }
}
