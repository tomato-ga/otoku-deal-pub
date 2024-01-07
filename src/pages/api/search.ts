import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/funcs/psdb'
import { RowDataPacket } from 'mysql2'

interface ProductInfo {
	id: number
	ASIN: string
	date: string
	affUrl: string
	descripText: string
	productName: string
	price: number
	priceOff: string
	imageUrl: string
}

export async function searchItems(keyword: string): Promise<ProductInfo[]> {
	const query = 'SELECT * FROM product_info WHERE descripText LIKE ? ORDER BY date DESC LIMIT 10'

	const values = [`%${keyword}%`]

	const [results] = await pool.query<RowDataPacket[]>(query, values)
	return results as ProductInfo[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const keyword = req.query.keyword as string
			if (!keyword) {
				res.status(400).json({ message: 'Keyword is required' })
				return
			}

			const results = await searchItems(keyword)
			res.status(200).json(results)
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' })
		}
	} else {
		res.setHeader('Allow', ['GET'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
