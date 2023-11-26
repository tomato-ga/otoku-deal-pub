// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemapIndexLegacy } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { dynamoSitemapIndexQuery } from '@/funcs/sitemapGenerate'

export const getServerSideProps = async (ctx) => {
	// TODO:  一日ごとに、トップインデックスのクエリ分だけURLを生成してxmlにする

	let siteMapUrl = []

	const indexDatas = await dynamoSitemapIndexQuery()
	indexDatas.map((data) => {
		let asinOnly = data.asin.S.replace('ASIN#', '')
		let url = 'https://www.otoku-deal.com/items/' + data.date.S + '/' + asinOnly
		siteMapUrl.push(url)
	})
	console.log(siteMapUrl)

	return getServerSideSitemapIndexLegacy(ctx, siteMapUrl)
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
