import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	function getErrorMessage(error: unknown): string {
		if (error instanceof Error) {
			return error.message
		}
		return 'An unexpected error occurred'
	}

	if (req.method === 'POST') {
		const { thumbUrl, postId } = req.body
		console.log(thumbUrl, postId)

		try {
			const result = await sql`
                UPDATE blog_posts
                SET Thumb_url = ${thumbUrl}
                WHERE id = ${postId}
                RETURNING id;
            `

			if (result.rows.length > 0) {
				return res.status(200).json({ message: 'Thumbnail URL updated' })
			} else {
				return res.status(404).json({ message: 'Article not found' })
			}
		} catch (error) {
			console.error('Failed to update thumbnail URL:', error)
			// エラーメッセージを取得してレスポンスにセット
			const errorMessage = getErrorMessage(error)
			return res.status(500).json({ message: 'Failed to update thumbnail URL', error: errorMessage })
		}
	} else {
		return res.status(405).end()
	}
}
