const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);

async function getPgVersion(req, res) {
    const result = await sql`select version()`;
    console.log(result);
    res.send(result);
}

module.exports = { sql, getPgVersion };