// pages/api/categoryitems.js
import { dynamoQueryCategory } from '@/funcs/CategoryDynamodb'

export default async function handler(req, res) {
	const { categoryname, lastkey } = req.query
	const lastEKey = lastkey ? JSON.parse(decodeURIComponent(lastkey)) : null

	const result = await dynamoQueryCategory(categoryname, 10, lastEKey)

	if (result.Items) {
		res.status(200).json({ Items: result.Items, LastKey: result.LastEvaluatedKey })
	} else {
		res.status(500).json({ error: 'APIルート データ取得失敗' })
	}
}
