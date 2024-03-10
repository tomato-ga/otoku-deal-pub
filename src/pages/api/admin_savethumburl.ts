import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { id, thumbUrl } = req.body

		try {
			// blog_postsテーブルの記事を更新して、Thumb_urlカラムにサムネイルURLを保存
			const result = await sql<{ count?: number }>`
            UPDATE blog_posts
            SET Thumb_url = ${thumbUrl}
            WHERE id = ${id}
            RETURNING COUNT(*);
            `

			// 例えば、result.rows[0]で結果にアクセスする必要があるかもしれません
			const count = result.rows[0]?.count || 0

			if (count === 1) {
				return res.status(200).json({ message: 'Thumbnail URL updated' })
			} else {
				return res.status(404).json({ message: 'Article not found' })
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Failed to update thumbnail URL', error })
		}
	} else {
		return res.status(405).end()
	}
}
