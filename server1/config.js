import mysql from "mysql2/promise";

let db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bootcamp_portfolio_app"
});

export default db;