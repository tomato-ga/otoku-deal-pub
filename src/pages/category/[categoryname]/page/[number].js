//  /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/tag/[tagpage]/page/[number].js

import { useEffect, useState } from 'react'
import TopHeader from '@/components/TopHeader'
import Sidebar from '@/components/Sidebar'

import CategoryItems from '@/components/CategoryItemIndex'
import CategoryPagination from '@/components/CategoryPaginaion'
import { dynamoQueryCategory } from '@/funcs/CategoryDynamodb'
import Footer from '@/components/Footer'
import { NextSeo } from 'next-seo'

const CategoryPages = ({ categoryResult, categoryLastkeyinitial, pageNumber, categoryName }) => {
	console.log('Saving cookie for page:', pageNumber, 'with key:', categoryLastkeyinitial) // ログ出力

	// カテゴリーページ
	const [categoryLastkey, setCategoryLastkey] = useState(categoryLastkeyinitial)

	useEffect(() => {
		if (categoryLastkey) {
			const existingKey = localStorage.getItem(`lastEvaluatedKey_category_page_${categoryName}_${pageNumber}`)
			if (!existingKey) {
				const storageValue = JSON.stringify(categoryLastkey)
				localStorage.setItem(`lastEvaluatedKey_category_page_${categoryName}_${pageNumber}`, storageValue)
			}
		}
	}, [categoryLastkey, pageNumber, categoryName])

	console.log('useEffect後のlastkey: ', categoryLastkey)

	return (
		<>
			<NextSeo title={categoryName} />

			<div className="flex flex-col min-h-screen">
				<TopHeader isPage={false} />
				<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
					<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
						<h2 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 relative">
							{categoryName}のセールアイテム
							<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#f087ff]  to-[#6e1fce] mb-2"></div>
						</h2>

						<CategoryItems categoryFromDynamo={categoryResult} />
						<CategoryPagination categoryName={categoryName} hasNextPage={!!categoryLastkey} />
					</div>

					<Sidebar />
				</div>
				<Footer />
			</div>
		</>
	)
}

export default CategoryPages

export async function getServerSideProps(context) {
	const { res } = context
	res.setHeader('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=86400')

	const categoryName = context.query.categoryname
	const pageNumber = parseInt(context.query.number) || 1
	const lastEvaluatedKey = context.query.lastkey ? JSON.parse(decodeURIComponent(context.query.lastkey)) : null
	const limit = 20

	// propsの初期化
	let props = {
		categoryResult: [],
		categoryLastkeyinitial: null,
		pageNumber,
		categoryName,
		error: null
	}

	if (pageNumber === 1) {
		const categoryResult = await dynamoQueryCategory(categoryName, limit)
		props.categoryResult = categoryResult.Items || []
		props.categoryLastkeyinitial = categoryResult.LastEvaluatedKey || null
		console.log('1.SSR実行', props.categoryLastkeyinitial)
	} else if (lastEvaluatedKey) {
		const categoryResultNextPage = await dynamoQueryCategory(categoryName, limit, lastEvaluatedKey)
		props.categoryResult = categoryResultNextPage.Items || []
		props.categoryLastkeyinitial = categoryResultNextPage.LastEvaluatedKey || null
		console.log('1.SSR実行', props.categoryLastkeyinitial)
	} else {
		props.error = 'LastEvaluatedKeyが見つかりませんでした。'
	}

	return { props }
}
