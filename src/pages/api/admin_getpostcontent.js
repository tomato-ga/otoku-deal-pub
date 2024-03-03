import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const postId = req.query.id // クエリパラメータからidを取得

			if (!postId) {
				return res.status(400).json({ message: 'Post ID is required' })
			}

			// データベースから特定のIDの投稿を取得する
			const result = await sql`
                SELECT * FROM blog_posts WHERE id = ${postId};
            `

			return res.status(200).json({ message: 'Post retrieved', data: result.rows[0] })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Failed to retrieve the post', error })
		}
	} else {
		return res.status(405).end()
	}
}
