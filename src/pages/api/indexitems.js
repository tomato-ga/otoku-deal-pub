// pages/api/indexitems.js
import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'

export default async function handler(req, res) {
	// URLパラメータからLastEvaluatedKeyを取得
	const { lastKey } = req.query
	const lastEvaluatedKey = lastKey ? JSON.parse(decodeURIComponent(lastKey)) : null

	// DynamoDBクエリを実行
	const result = await dynamoQueryIndex(lastEvaluatedKey)

	if (result.Items) {
		res.status(200).json({ items: result.Items, lastEvaluatedKey: result.LastEvaluatedKey })
	} else {
		res.status(500).json({ error: 'データ取得に失敗しました' })
	}
}
