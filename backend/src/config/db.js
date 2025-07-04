const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "student",
  database: "waste_sorting_system",
  port: 5432,
});

module.exports = pool;
