// require('dotenv').config()
// const mysql = require('mysql2/promise')

// export default async function sitemapsql(req, res) {
// 	let connection
// 	let siteMapCategoryUrl = [
// 		// ここにカテゴリーURLのリストを挿入
// 		'https://www.otoku-deal.com/category/%E5%AE%B6%E9%9B%BB%EF%BC%86%E3%82%AB%E3%83%A1%E3%83%A9/page/1',
// 		'https://www.otoku-deal.com/category/%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B3%E3%83%BB%E5%91%A8%E8%BE%BA%E6%A9%9F%E5%99%A8/page/1',
// 		'https://www.otoku-deal.com/category/%E3%83%9B%E3%83%BC%E3%83%A0%EF%BC%86%E3%82%AD%E3%83%83%E3%83%81%E3%83%B3/page/1',
// 		'https://www.otoku-deal.com/category/%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%EF%BC%86%E3%82%A2%E3%82%A6%E3%83%88%E3%83%89%E3%82%A2/page/1',
// 		'https://www.otoku-deal.com/category/%E9%A3%9F%E5%93%81%E3%83%BB%E9%A3%B2%E6%96%99%E3%83%BB%E3%81%8A%E9%85%92/page/1',
// 		'https://www.otoku-deal.com/category/%E3%82%B2%E3%83%BC%E3%83%A0/page/1',
// 		'https://www.otoku-deal.com/category/%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E3%82%B9%E3%83%88%E3%82%A2/page/1',
// 		'https://www.otoku-deal.com/category/%E3%83%95%E3%82%A1%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3/page/1',
// 		'https://www.otoku-deal.com/category/%E3%83%93%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%BC/page/1',
// 		'https://www.otoku-deal.com/category/DIY%E3%83%BB%E5%B7%A5%E5%85%B7%E3%83%BB%E3%82%AC%E3%83%BC%E3%83%87%E3%83%B3/page/1',
// 		'https://www.otoku-deal.com/category/%E3%81%8A%E3%82%82%E3%81%A1%E3%82%83/page/1',
// 		'https://www.otoku-deal.com/category/%E3%83%9A%E3%83%83%E3%83%88%E7%94%A8%E5%93%81/page/1',
// 		'https://www.otoku-deal.com/group/page/1'
// 	]

// 	try {
// 		connection = await mysql.createConnection(process.env.PS_DATABASE_URL)

// 		const limit = 1000
// 		let offset = 0
// 		let hasMore = true
// 		let productUrls = []

// 		while (hasMore) {
// 			const [rows, fields] = await connection.query('SELECT * FROM sitemapurl LIMIT ? OFFSET ?', [limit, offset])
// 			for (const row of rows) {
// 				let url = 'https://www.otoku-deal.com/items/' + row.date + '/' + row.asin
// 				productUrls.push(url)
// 			}
// 			offset += limit
// 			hasMore = rows.length === limit
// 		}

// 		// カテゴリーURLと商品URLを結合
// 		let allUrls = siteMapCategoryUrl.concat(productUrls)

// 		// XMLを生成
// 		const xml = generateXml(allUrls)
// 		res.setHeader('Content-Type', 'text/xml')
// 		res.write(xml)
// 		res.end()
// 	} catch (err) {
// 		console.error('Database connection or query failed:', err)
// 		res.status(500).json({ message: 'Internal server error' })
// 	} finally {
// 		if (connection) {
// 			await connection.end()
// 		}
// 	}
// }

// function generateXml(urls) {
// 	// XMLのヘッダー
// 	let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
// 	xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

// 	// 各URLに対するXML要素を追加
// 	urls.forEach((url) => {
// 		xml += `  <url>\n`
// 		xml += `    <loc>${url}</loc>\n`
// 		xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
// 		xml += `    <priority>0.5</priority>\n`
// 		xml += `  </url>\n`
// 	})

// 	// XMLのフッター
// 	xml += `</urlset>\n`

// 	return xml
// }
