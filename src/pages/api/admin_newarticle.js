import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { title, content, tags, author } = req.body

		// タグの配列をカンマ区切りの文字列に変換
		const tagsString = Array.isArray(tags) ? tags.join(',') : tags

		try {
			// データベースに記事を挿入
			const result = await sql`
                INSERT INTO blog_posts (title, content, tags, author)
                VALUES (${title}, ${content}, ${tagsString}, ${author});
            `

			return res.status(200).json({ message: 'Article saved', result })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Failed to save article', error })
		}
	} else {
		return res.status(405).end()
	}
}
