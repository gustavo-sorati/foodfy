const db = require("../../db");

module.exports = {
  async save({ file_id, recipe_id }) {
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
  },
  async findByRecipeId(id){
    const query = `
      SELECT * FROM recipe_files
      WHERE recipe_id = ${id}
    `;

    const results = await db.query(query);

    return results.rows;
  },
  removeByFileId(id){
    const query = `
      DELETE FROM recipe_files
      WHERE file_id = ${id}
    `;

    db.query(query);
  }
}
