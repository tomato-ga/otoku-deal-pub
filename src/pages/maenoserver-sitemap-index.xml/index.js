// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemapIndexLegacy } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { dynamoSitemapIndexQuery } from '@/funcs/sitemapGenerate'

export const getServerSideProps = async ({ ctx }) => {
	ctx.setHeader('Content-Type', 'text/xml')

	let siteMapUrl = []

	const indexDatas = await dynamoSitemapIndexQuery()
	indexDatas.map((data) => {
		let asinOnly = data.asin.S.replace('ASIN#', '')
		let url = 'https://www.otoku-deal.com/items/' + data.date.S + '/' + asinOnly
		siteMapUrl.push(url)
	})

	siteMapUrl = [
		...siteMapUrl,
		'https://www.otoku-deal.com/category/%E5%AE%B6%E9%9B%BB%EF%BC%86%E3%82%AB%E3%83%A1%E3%83%A9/page/1',
		'https://www.otoku-deal.com/category/%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B3%E3%83%BB%E5%91%A8%E8%BE%BA%E6%A9%9F%E5%99%A8/page/1',
		'https://www.otoku-deal.com/category/%E3%83%9B%E3%83%BC%E3%83%A0%EF%BC%86%E3%82%AD%E3%83%83%E3%83%81%E3%83%B3/page/1',
		'https://www.otoku-deal.com/category/%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%EF%BC%86%E3%82%A2%E3%82%A6%E3%83%88%E3%83%89%E3%82%A2/page/1',
		'https://www.otoku-deal.com/category/%E9%A3%9F%E5%93%81%E3%83%BB%E9%A3%B2%E6%96%99%E3%83%BB%E3%81%8A%E9%85%92/page/1',
		'https://www.otoku-deal.com/category/%E3%82%B2%E3%83%BC%E3%83%A0/page/1',
		'https://www.otoku-deal.com/category/%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E3%82%B9%E3%83%88%E3%82%A2/page/1',
		'https://www.otoku-deal.com/category/%E3%83%95%E3%82%A1%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3/page/1',
		'https://www.otoku-deal.com/category/%E3%83%93%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%BC/page/1',
		'https://www.otoku-deal.com/category/DIY%E3%83%BB%E5%B7%A5%E5%85%B7%E3%83%BB%E3%82%AC%E3%83%BC%E3%83%87%E3%83%B3/page/1',
		'https://www.otoku-deal.com/category/%E3%81%8A%E3%82%82%E3%81%A1%E3%82%83/page/1',
		'https://www.otoku-deal.com/category/%E3%83%9A%E3%83%83%E3%83%88%E7%94%A8%E5%93%81/page/1',
		'https://www.otoku-deal.com/group/page/1'
	]

	console.log(siteMapUrl)

	return getServerSideSitemapIndexLegacy(ctx, siteMapUrl)
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
