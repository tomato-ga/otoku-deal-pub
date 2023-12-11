import { sql } from '@vercel/postgres'

export default async function handler(request, response) {
	try {
		const result = await sql`CREATE TABLE blog_posts (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			author VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			content TEXT NOT NULL,
			tags TEXT
		);
		;`
		return response.status(200).json({ result })
	} catch (error) {
		return response.status(500).json({ error })
	}
}
