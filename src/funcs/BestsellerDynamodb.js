const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')

export const dynamoBestSellerQuery = async (category) => {
	const client = new DynamoDBClient({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	// 日付をフォーマットする関数
	const formatDate = (date) => {
		const year = date.getFullYear().toString()
		const month = `0${date.getMonth() + 1}`.slice(-2)
		const day = `0${date.getDate()}`.slice(-2)
		return `${year}-${month}-${day}`
	}

	// データのソートと制限を行う関数
	const sortAndLimitData = (data) => {
		if (data && Array.isArray(data.Items)) {
			data.Items.sort((a, b) => {
				let rankA = parseInt(a.rank.N)
				let rankB = parseInt(b.rank.N)
				return rankA - rankB
			})

			return data.Items.slice(0, 10) // 最初の10件のみを返す
		} else {
			console.error('Data.Items is undefined or not an array')
			return [] // 空の配列を返す
		}
	}

	const now = new Date()
	const formattedDate = formatDate(now)

	const createParams = (date, category) => ({
		TableName: 'bestsellerItems',
		IndexName: 'date-rankingUrl-index',
		KeyConditionExpression: '#date = :dateVal AND #rankingUrl = :rankingUrlVal',
		ExpressionAttributeNames: {
			'#date': 'date',
			'#rankingUrl': 'rankingUrl'
		},
		ExpressionAttributeValues: {
			':dateVal': { S: date },
			':rankingUrlVal': { S: category }
		},
		Limit: 50
	})

	const queryDynamoDB = async (params) => {
		try {
			const command = new QueryCommand(params)
			const data = await client.send(command)

			if (!data.Items || !Array.isArray(data.Items) || data.Items.length === 0) {
				console.log('No data for date:', params.ExpressionAttributeValues[':dateVal'].S)
				let previousDay = new Date(now)
				previousDay.setDate(previousDay.getDate() - 1)
				const previousParams = createParams(formatDate(previousDay), category)
				return queryDynamoDB(previousParams)
			} else {
				return sortAndLimitData(data)
			}
		} catch (error) {
			console.error('Query failed, error:', error)
			throw error
		}
	}

	const initialParams = createParams(formattedDate, category)
	const propdata = await queryDynamoDB(initialParams)

	return propdata
}

module.exports = { dynamoBestSellerQuery }
