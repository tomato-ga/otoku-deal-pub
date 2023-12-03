//  /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/tag/[tagpage]/page/[number].js

import { useEffect } from 'react'
import TopHeader from '@/components/TopHeader'
import Sidebar from '@/components/Sidebar'

import CategoryItems from '@/components/CategoryItemIndex'
import CategoryPagination from '@/components/CategoryPaginaion'
import { dynamoQueryCategory } from '@/funcs/CategoryDynamodb'
import Footer from '@/components/Footer'
import { NextSeo } from 'next-seo'

// TODO APIルートを使って、paginateScanで実装する -> lastkeyは結局保存しておかないといけない

const CategoryPages = ({ categoryResult, categoryLastkey, pageNumber, categoryName }) => {
	// console.log("Saving cookie for page:", pageNumber, "with key:", result.lastEvaluatedKey); // ログ出力
	const showPagination = !categoryResult.endOfData

	// カテゴリーページ
	useEffect(() => {
		if (categoryLastkey) {
			const existingKey = localStorage.getItem(`lastEvaluatedKey_category_page_${categoryName}_${pageNumber}`)
			if (!existingKey) {
				const storageValue = JSON.stringify(categoryLastkey)
				localStorage.setItem(`lastEvaluatedKey_category_page_${categoryName}_${pageNumber}`, storageValue)
			}
		}
	}, [categoryLastkey, pageNumber])

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

	if (pageNumber == 1) {
		const categoryResult = await dynamoQueryCategory(categoryName, limit)
		return {
			props: {
				categoryResult: categoryResult.Items || [],
				categoryLastkey: categoryResult.LastEvaluatedKey || null,
				pageNumber,
				categoryName
			}
		}
	}

	if (pageNumber > 1) {
		if (lastEvaluatedKey) {
			const categoryResultNextPage = await dynamoQueryCategory(categoryName, limit, lastEvaluatedKey)

			return {
				props: {
					categoryResult: categoryResultNextPage.Items || [],
					categoryLastkey: categoryResultNextPage.LastEvaluatedKey || null,
					pageNumber,
					categoryName
				}
			}
		} else {
			return {
				props: {
					categoryResult: [],
					categoryLastkey: null,
					pageNumber,
					categoryName,
					error: 'LastEvaluatedKeyが見つかりませんでした。'
				}
			}
		}
	}
	return {
		props: {
			categoryResult: [],
			categoryLastkey: null,
			pageNumber,
			categoryName,
			error: 'LastEvaluatedKeyが見つかりませんでした。'
		}
	}
}
