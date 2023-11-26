const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb')
require('dotenv').config()

const ClickCounter = async (asin) => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	const command = new UpdateItemCommand({
		TableName: 'saleitems',
		Key: {
			asin: { S: asin }, // DynamoDBの文字列型で指定
			type: { S: 'アクション' } // DynamoDBの文字列型で指定
		},
		UpdateExpression: 'ADD #clickAttr :incr',
		ExpressionAttributeNames: {
			'#clickAttr': 'impClick'
		},
		ExpressionAttributeValues: {
			':incr': { N: '1' } // 数値型で指定
		}
	})

	try {
		const response = await client.send(command)
		console.log('Update response:', response)
	} catch (error) {
		console.error('Error updating item:', error)
	}
}

module.exports = { ClickCounter }
