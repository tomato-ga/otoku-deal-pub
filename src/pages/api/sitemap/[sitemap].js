// /Users/don/Codes/otoku-deal/src/pages/api/sitemap/[sitemap].js

// サイトマップインデックスを生成するAPIエンドポイント
// sitemap.js

require('dotenv').config()
const mysql = require('mysql2/promise')

export default async function handler(req, res) {
	const { sitemap } = req.query

	let connection

	try {
		connection = await mysql.createConnection(process.env.DATABASE_URL)

		// 総レコード数を取得
		const [rows] = await connection.query('SELECT COUNT(*) AS count FROM sitemap')
		const totalCount = rows[0].count

		// 1ページあたりの限度数
		const limit = 1000

		// 必要なsitemap数を算出
		const sitemapCount = Math.ceil(totalCount / limit)

		// sitemapのインデックスXMLを生成
		const xml = generateSitemapIndex(sitemapCount)

		res.setHeader('Content-Type', 'text/xml')
		res.send(xml)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	} finally {
		if (connection) {
			connection.end()
		}
	}
}

function generateSitemapIndex(count) {
	let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`

	xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

	for (let i = 0; i < count; i++) {
		// 現在のページ番号
		const page = parseInt(sitemap)

		// オフセットを計算
		const offset = page * limit

		xml += `  <sitemap>\n`
		xml += `    <loc>https://example.com/api/sitemap?sitemap=${page}</loc>\n`
		xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
		xml += `  </sitemap>\n`
	}

	xml += `</sitemapindex>\n`

	return xml
}
