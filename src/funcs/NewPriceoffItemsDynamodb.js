const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// DynamoDBクエリ関数
const dynamoPriceoffQuery = async (lastEvaluatedKey = null) => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	// DynamoDBクエリ実行関数
	const queryDynamoDB = async () => {
		let today = new Date()
		today.setDate(today.getDate() - 3) // 最新の日付から3日前に設定
		let startDate = today.toISOString().split('T')[0]

		const params = {
			TableName: 'saleitems',
			IndexName: 'date-priceOff-index', // GSIの名前を修正
			KeyConditionExpression: '#date >= :startDate',
			ExpressionAttributeValues: {
				':startDate': startDate
			},
			ExpressionAttributeNames: {
				'#date': 'date'
			},
			Limit: 5,
			ScanIndexForward: false, // 割引率が高い順
			...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
		}

		const command = new QueryCommand(params)
		return await client.send(command)
	}

	try {
		let data = await queryDynamoDB()
		return data
	} catch (error) {
		console.error('Query failed, error:', error)
		throw error
	}
}

module.exports = { dynamoPriceoffQuery }
