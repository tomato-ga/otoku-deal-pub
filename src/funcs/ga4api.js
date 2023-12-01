const { BetaAnalyticsDataClient } = require('@google-analytics/data')
const analyticsDataClient = new BetaAnalyticsDataClient()

process.env.GOOGLE_APPLICATION_CREDENTIALS = `./saleproject_service.json`
const propertyId = '417099349'

// MEMO ページビュー高い順取得できた
async function runReport() {
	const [response] = await analyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
			{
				startDate: '30daysAgo',
				endDate: 'today'
			}
		],
		dimensions: [
			{
				name: 'pagePath'
			}
		],
		metrics: [
			{
				name: 'screenPageViews'
			}
		],
		limit: 5
	})
	response.rows.forEach((row) => {
		console.log(row.dimensionValues[0], row.metricValues[0])
	})
}

runReport()
