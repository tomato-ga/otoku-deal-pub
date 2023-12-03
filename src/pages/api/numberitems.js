import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'

export default async function handler(req, res) {
	const { lastkey } = req.query
	const result = await dynamoQueryIndex(lastkey)

	if (result.Items) {
		res.status(200).json({ items: result.Items, lastEvaluatedKey: result.LastEvaluatedKey })
	} else {
		res.status(500).json({ error: 'データ取得に失敗' })
	}
}
