import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			// データベースからランダムに最新の投稿を取得する
			const result = await sql`
                SELECT * FROM (
                SELECT id, title, thumb_url, updated_at 
                FROM blog_posts 
                ORDER BY updated_at DESC 
                LIMIT 50
                ) AS latest_posts
                ORDER BY RANDOM() 
                LIMIT 10;
            `

			return res.status(200).json({ message: 'Random posts retrieved', data: result.rows })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Failed to retrieve posts', error })
		}
	} else {
		return res.status(405).end()
	}
}
