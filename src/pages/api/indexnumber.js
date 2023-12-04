import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'

export default async function handler(req, res) {
	const { lastkey } = req.query
	const lastEKey = lastkey ? JSON.parse(decodeURIComponent(lastkey)) : null

	try {
		const result = await dynamoQueryIndex(lastEKey)

		if (result.Items) {
			res.status(200).json({ Items: result.Items, LastKey: result.LastEvaluatedKey })
		} else {
			throw new Error('データが見つかりません')
		}
	} catch (error) {
		console.error('APIエラー:', error)
		res.status(500).json({ error: 'APIルートindexnumber.js データ取得失敗', message: error.message })
	}
}
