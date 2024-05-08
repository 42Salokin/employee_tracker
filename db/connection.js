const { Pool } = require("pg");
// Installs postgres, creates instance to call for db queries
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "rootroot", 
  database: "employees",
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
