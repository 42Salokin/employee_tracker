const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "rootroot", 
  database: "employees",
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
