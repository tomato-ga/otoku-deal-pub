const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// DynamoDBクエリ関数
// lastEvaluatedKeyをパラメータとして追加
const dynamoQueryIndex = async (lastEvaluatedKey = null) => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	// DynamoDBクエリ関数
	const queryDynamoDB = async () => {
		const params = {
			TableName: 'saleitems',
			IndexName: 'dealUrlExists-date_asin-index',
			KeyConditionExpression: '#dealUrlExists = :duExists',
			ExpressionAttributeNames: {
				'#dealUrlExists': 'dealUrlExists' // 修正されたマッピング
			},
			ExpressionAttributeValues: {
				':duExists': { S: 'false' }
			},
			Limit: 20,
			ScanIndexForward: false, // 最新順
			...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
		}

		try {
			const response = await client.send(new QueryCommand(params))
			return response
		} catch (error) {
			console.error('Query failed:', error)
			return []
		}
	}

	try {
		let data = await queryDynamoDB()
		return data
	} catch (error) {
		console.error('Query failed, error:', error)
		throw error
	}
}

module.exports = { dynamoQueryIndex }
