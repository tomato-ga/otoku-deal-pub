const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// DynamoDBクエリ関数
const dynamoQueryDeal = async (lastEvaluatedKey = null) => {
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
		let formattedToday = today.toISOString().split('T')[0]

		const params = {
			TableName: 'saleitems',
			IndexName: 'dealUrlExists-datedealUrl-index',
			KeyConditionExpression: '#dealUrlExists = :dealUrlExistsVal AND #dateDealUrl >= :startDate',
			// MEMO 日付範囲指定の場合↓
			// KeyConditionExpression: '#dealUrlExists = :dealUrlExistsVal AND #dateDealUrl BETWEEN :startDate AND :endDate',
			ExpressionAttributeValues: {
				':dealUrlExistsVal': { S: 'true' },
				':startDate': { S: '2023-11-19' }
			},
			ExpressionAttributeNames: {
				'#dealUrlExists': 'dealUrlExists',
				'#dateDealUrl': 'date#dealUrl'
			},
			Limit: 60,
			ScanIndexForward: false,
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

module.exports = { dynamoQueryDeal }
