require('dotenv').config()
const mysql = require('mysql2/promise')

const databaseUrl = process.env.PS_DATABASE_URL
const pool = mysql.createPool(databaseUrl)

export default pool
