// /Volumes/SSD_1TB/otoku-deal/src/pages/api/dealnumber.js

import { dynamoQueryDeal } from '@/funcs/DealIndexDynamodb'

export default async function handler(req, res) {
	const { lastkey } = req.query
	const lastEKey = lastkey ? JSON.parse(decodeURIComponent(lastkey)) : null

	try {
		const result = await dynamoQueryDeal(lastEKey)

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
