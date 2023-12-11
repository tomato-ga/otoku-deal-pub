import { sql } from '@vercel/postgres'

export default async function handler(request, response) {
	try {
		await sql`INSERT INTO Pets (Name, Owner) VALUES ('しば', 'いぬ');`
	} catch (error) {
		return response.status(500).json({ error })
	}

	const pets = await sql`SELECT * FROM Pets;`
	return response.status(200).json({ pets })
}
