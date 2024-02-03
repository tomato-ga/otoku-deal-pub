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
			KeyConditionExpression: '#dealUrlExists = :dealUrlExistsVal',
			ExpressionAttributeValues: {
				':dealUrlExistsVal': { S: 'true' }
			},
			ExpressionAttributeNames: {
				'#dealUrlExists': 'dealUrlExists'
			},
			Limit: 45,
			ScanIndexForward: false,
			...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
		}

		const command = new QueryCommand(params)
		return await client.send(command)
	}

	try {
		let data = await queryDynamoDB()

		// llmflagがfalseの場合、llmtitleとllmcontentを除外するフィルタリング処理
		const filteredItems = data.Items.map((item) => {
			if (item.llmflag && item.llmflag.S === 'false') {
				delete item.llmtitle
				delete item.llmcontent
			}
			return item
		})

		// フィルタリング後のデータを含む新しいオブジェクトを作成して返す
		return {
			...data,
			Items: filteredItems
		}
	} catch (error) {
		console.error('Query failed, error:', error)
		throw error
	}
}

module.exports = { dynamoQueryDeal }

// 以前のコード　正常動作
// const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

// // DynamoDBクエリ関数
// const dynamoQueryDeal = async (lastEvaluatedKey = null) => {
// 	const client = new DynamoDBClient({
// 		region: 'ap-northeast-1',
// 		credentials: {
// 			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// 		}
// 	})

// 	// DynamoDBクエリ実行関数
// 	const queryDynamoDB = async () => {
// 		let today = new Date()
// 		let formattedToday = today.toISOString().split('T')[0]

// 		const params = {
// 			TableName: 'saleitems',
// 			IndexName: 'dealUrlExists-datedealUrl-index',
// 			KeyConditionExpression: '#dealUrlExists = :dealUrlExistsVal',
// 			ExpressionAttributeValues: {
// 				':dealUrlExistsVal': { S: 'true' }
// 			},
// 			ExpressionAttributeNames: {
// 				'#dealUrlExists': 'dealUrlExists'
// 			},
// 			Limit: 45, // MEMO Limit 30だとページングがうまくいかなかったので40以上にした 2023/12/16
// 			ScanIndexForward: false,
// 			...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
// 		}

// 		const command = new QueryCommand(params)
// 		return await client.send(command)
// 	}

// 	try {
// 		let data = await queryDynamoDB()

// 		return data
// 	} catch (error) {
// 		console.error('Query failed, error:', error)
// 		throw error
// 	}
// }

// module.exports = { dynamoQueryDeal }
