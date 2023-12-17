import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { title, content, tags, author } = req.body

		try {
			// データベースに記事を挿入
			// TODO UPDATEメソッドへ変更する, 時間を追加する
			const result = await sql`
                INSERT INTO blog_posts (title, content, tags, author)
                VALUES (${title}, ${content}, ${tags}, ${author});
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
