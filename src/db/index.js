const { Pool } = require('pg');

module.exports = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'foodfy',
  password: 'postgres',
  port: 5432,
});
