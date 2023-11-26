const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// DynamoDBクエリ関数
const dynamoQueryAsin = async (asin, types) => {
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
		let formattedToday = today.toISOString().split('T')[0] // "YYYY-MM-DD" 形式に変換

		const params = {
			TableName: 'saleitems',
			KeyConditionExpression: '#asin = :asinVal AND #type = :typeVal',
			ExpressionAttributeValues: {
				':asinVal': { S: 'ASIN#' + asin },
				':typeVal': { S: types }
			},
			ExpressionAttributeNames: {
				'#asin': 'asin',
				'#type': 'type'
			},
			Limit: 1
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

module.exports = { dynamoQueryAsin }
