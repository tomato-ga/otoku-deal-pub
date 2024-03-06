import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { id, title, content, tags, author } = req.body

		// tags 配列をカンマ区切りの文字列に変換
		const tagsString = tags.join(',')

		try {
			// データベースの記事を更新
			const result = await sql`
                UPDATE blog_posts
                SET title = ${title}, content = ${content}, tags = ${tagsString}, author = ${author}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id};
            `

			return res.status(200).json({ message: 'Article updated', result })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Failed to update article', error })
		}
	} else {
		return res.status(405).end()
	}
}
