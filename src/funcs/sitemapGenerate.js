const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

const dynamoSitemapIndexQuery = async () => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	const queryIndex = async () => {
		let allData = []

		for (let i = 0; i < 10; i++) {
			const queryDate = new Date()
			queryDate.setDate(queryDate.getDate() - i)

			console.log('日付', queryDate.toISOString().split('T')[0])

			const params = {
				TableName: 'saleitems',
				IndexName: 'dealUrlExists-date_asin-index',
				KeyConditionExpression: '#dealUrlExists = :duExists AND begins_with(#dateAsin, :queryDate)',
				ExpressionAttributeNames: {
					'#dealUrlExists': 'dealUrlExists',
					'#dateAsin': 'date#asin'
				},
				ExpressionAttributeValues: {
					':duExists': { S: 'false' },
					':queryDate': { S: queryDate.toISOString().split('T')[0] }
				},
				Limit: 5
			}

			try {
				const response = await client.send(new QueryCommand(params))
				if (response.Items) {
					allData.push(...response.Items)
				}
			} catch (error) {
				console.error('Query failed:', error)
				return []
			}
		}

		return allData
	}

	try {
		let data = await queryIndex()
		return data
	} catch (error) {
		console.error('Query failed, error:', error)
		throw error
	}
}

module.exports = { dynamoSitemapIndexQuery }
