const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// llmflagがtrueの項目をクエリするDynamoDB関数
const dynamoQueryLlmflagTrue = async (lastEvaluatedKey = null) => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	// llmflagがtrueの項目をクエリする関数
	const queryDynamoDB = async () => {
		const params = {
			TableName: 'saleitems',
			IndexName: 'llmflag-date-index', // GSI名
			KeyConditionExpression: '#llmflag = :llmflagVal',
			ExpressionAttributeValues: {
				':llmflagVal': { S: 'true' } // llmflagがtrueの項目を指定
			},
			ExpressionAttributeNames: {
				'#llmflag': 'llmflag'
			},
			Limit: 45, // 取得する項目の数を制限
			ScanIndexForward: false, // 降順でクエリ
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

module.exports = { dynamoQueryLlmflagTrue }
