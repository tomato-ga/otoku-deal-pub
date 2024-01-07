import mysql from 'mysql2/promise'
require('dotenv').config()

const databaseUrl = process.env.PS_DATABASE_URL
const pool = mysql.createPool(databaseUrl)

export default pool
