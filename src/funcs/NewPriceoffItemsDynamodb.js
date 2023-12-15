const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// DynamoDBクエリ関数
const dynamoPriceoffQuery = async () => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	// 指定日付に対するクエリを実行する関数
	const queryByDate = async (date) => {
		const params = {
			TableName: 'saleitems',
			IndexName: 'date-priceOff-index',
			KeyConditionExpression: '#date = :dateVal',
			ExpressionAttributeValues: {
				':dateVal': { S: date }
			},
			ExpressionAttributeNames: {
				'#date': 'date'
			},
			Limit: 20,
			ScanIndexForward: false
		}
		return await client.send(new QueryCommand(params))
	}

	// 過去3日間の日付に対してクエリを実行
	let results = []
	for (let i = 0; i < 3; i++) {
		let queryDate = new Date()
		queryDate.setDate(queryDate.getDate() - i)
		let dateString = queryDate.toISOString().split('T')[0]
		try {
			let data = await queryByDate(dateString)
			results.push(...data.Items)
		} catch (error) {
			console.error(`Query failed for date ${dateString}, error:`, error)
		}
	}

	// 結果を統合して返す
	return results
}

module.exports = { dynamoPriceoffQuery }
