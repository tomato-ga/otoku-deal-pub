import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'

export const dynamoQueryPopularClick = async () => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	const queryDynamoDB = async () => {
		const params = {
			TableName: 'saleitems',
			IndexName: '',
			KeyConditionExpression: '#type = :clickType AND ',
			ExpressionAttributeNames: {
				'#type': 'clickType' // 修正されたマッピング
			},
			ExpressionAttributeValues: {
				':clickType': { S: 'アクション' }
			},
			Limit: 10,
			ScanIndexForward: false
		}

		try {
			const response = await client.send(new QueryCommand(params))
			return response
		} catch (error) {
			console.error('Query failed:', error)
			return []
		}
	}
}
