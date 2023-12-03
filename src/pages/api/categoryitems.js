// pages/api/categoryitems.js
import { dynamoQueryCategory } from '@/funcs/CategoryDynamodb'

export default async function handler(req, res) {
	const { categoryName, lastKey } = req.query
	const lastEvaluatedKey = lastKey ? JSON.parse(decodeURIComponent(lastKey)) : null

	// DynamoDBクエリを実行
	const result = await dynamoQueryCategory(categoryName, 20, lastEvaluatedKey)

	if (result.Items) {
		res.status(200).json({ items: result.Items, lastEvaluatedKey: result.LastEvaluatedKey })
	} else {
		res.status(500).json({ error: 'データ取得に失敗しました' })
	}
}
