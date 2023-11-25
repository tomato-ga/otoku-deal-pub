const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

function decreaseOneDay(date) {
	const previousDay = new Date(date.getTime())
	previousDay.setDate(date.getDate() - 1)
	return previousDay
}

const dynamoPaginationQuery = async (lastkey) => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	const endDate = new Date('2023-11-01')
	let queryDate = lastkey ? new Date(lastkey.date.S) : new Date()
	const groupedItems = {}

	while (queryDate >= endDate) {
		const formattedDate = queryDate.toISOString().split('T')[0]

		const params = {
			TableName: 'saleitemsAll',
			IndexName: 'date-dealUrl-index',
			KeyConditionExpression: '#date = :dateVal',
			ExpressionAttributeNames: { '#date': 'date' },
			ExpressionAttributeValues: { ':dateVal': { S: formattedDate } },
			ExclusiveStartKey: lastkey,
			Limit: 100
		}

		const response = await client.send(new QueryCommand(params))

		// アイテムが取得されなかった場合、日付を減らして再試行
		if (response.Items.length === 0) {
			queryDate = decreaseOneDay(queryDate)
			lastkey = undefined
			continue
		}

		response.Items.forEach((item) => {
			const groupKey = item.dealUrl.S
			if (!groupedItems[groupKey]) {
				groupedItems[groupKey] = []
			}
			groupedItems[groupKey].push(item)
		})

		lastkey = response.LastEvaluatedKey

		// lastkeyがない場合、日付を減らす
		if (!lastkey) {
			queryDate = decreaseOneDay(queryDate)
			lastkey = undefined
		}
	}

	return [groupedItems, lastkey]
}

module.exports = { dynamoPaginationQuery }
