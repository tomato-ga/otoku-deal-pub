const { BetaAnalyticsDataClient } = require('@google-analytics/data')
const analyticsDataClient = new BetaAnalyticsDataClient()

process.env.GOOGLE_APPLICATION_CREDENTIALS = `./saleproject_service.json`
const propertyId = '417099349'

// MEMO ページビュー高い順取得できた
// TODO Vercelからは環境変数で設定する　https://7nohe-tech-blog.vercel.app/post/node-js-google-analytics-4-ga4-contentful-google-analytics-data-api
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
