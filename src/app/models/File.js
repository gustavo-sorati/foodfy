const db = require("../../db");

module.exports = {
  async findOne(filters) {
    let query = `
      SELECT * FROM files
    `;

    Object.keys(filters).map((key) => {
      query += `${key}`

      Object.keys(filters[key]).map(field => {
        query += ` ${field} = ${filters[key][field]}`
      });
    });

    const results = await db.query(query);
    return results.rows[0];
  },
  // save ok
  async save({ filename, path }) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      filename,
      path
    ];

    const results = await db.query(query, values);

    return results.rows[0].id;
  },
  async FindById(image_id){
    const query = `
      SELECT * FROM files
      WHERE id = ${image_id}
    `;

    const results = await db.query(query);

    return results.rows[0];
  },
  async remove(file_id){
    const query = `
      DELETE FROM files
      WHERE files.id = ${file_id}
    `;

    await db.query(query);
  }
}
