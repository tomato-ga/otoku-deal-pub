// /Users/don/Codes/otoku-deal/src/pages/api/sitemap/[sitemap].js

// サイトマップインデックスを生成するAPIエンドポイント
require('dotenv').config()
const mysql = require('mysql2/promise')

export default async function sitemapIndex(req, res) {

    const { sitemap } = req.query

	let connection
	try {
		connection = await mysql.createConnection(process.env.PS_DATABASE_URL)
		const [rows] = await connection.query('SELECT COUNT(*) AS count FROM sitemapurl')
		const totalCount = rows[0].count
		const limit = 1000
		const sitemapCount = Math.ceil(totalCount / limit)

		const xml = generateSitemapIndex(sitemapCount)
		res.setHeader('Content-Type', 'text/xml')
		res.send(xml)
	} catch (err) {
		console.error('Database connection or query failed:', err)
		res.status(500).json({ message: 'Internal server error' })
	} finally {
		if (connection) {
			await connection.end()
		}
	}
}

function generateSitemapIndex(count) {
	let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
	xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

	for (let i = 0; i < count; i++) {
		xml += `  <sitemap>\n`
		xml += `    <loc>https://www.otoku-deal.com/api/sitemap?sitemap=${i}</loc>\n`
		xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
		xml += `  </sitemap>\n`
	}

	xml += `</sitemapindex>\n`
	return xml
}
