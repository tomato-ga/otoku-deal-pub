import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const page = req.query.page ? parseInt(req.query.page) : 1
			const limit = 50
			const offset = (page - 1) * limit

			// データベースから記事一覧をページネーションで取得する
			const result = await sql`
			SELECT id, title, updated_at, thumb_url, tags
			FROM blog_posts
			ORDER BY updated_at DESC
			LIMIT ${limit} OFFSET ${offset};
		`

			return res.status(200).json({ message: 'Posts retrieved', data: result.rows })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Failed to retrieve posts', error })
		}
	} else {
		return res.status(405).end()
	}
}

// SELECT * FROM blog_posts LIMIT ${limit} OFFSET ${offset};
