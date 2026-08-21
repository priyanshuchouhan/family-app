const { Pool } = require("pg");
require("dotenv").config();

console.log("=== DATABASE DEBUG ===");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    console.log("DATABASE HOST:", url.hostname);
    console.log("DATABASE PORT:", url.port || "5432");
    console.log("DATABASE NAME:", url.pathname);
} else {
    console.log("DATABASE_URL IS MISSING");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

module.exports = pool;