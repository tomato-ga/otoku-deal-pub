import Link from 'next/link'
import { useEffect } from 'react'

import TopHeader from '@/components/TopHeader'
import DealItems from '@/components/DealItemIndex'
import { dynamoQueryDeal } from '@/funcs/DealIndexDynamodb'
import DealPagination from '@/components/DealPagination'

import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { NextSeo } from 'next-seo'

const GroupSalePage = ({ dealItemsFromDynamo, LastEvaluatedKey, pageNumber }) => {
	useEffect(() => {
		if (LastEvaluatedKey) {
			const existingKey = localStorage.getItem(`lastEvaluatedKey_group_page_${pageNumber}`)
			if (!existingKey) {
				const storageValue = JSON.stringify(LastEvaluatedKey)
				localStorage.setItem(`lastEvaluatedKey_group_page_${pageNumber}`, storageValue)
			}
		}
	}, [LastEvaluatedKey, pageNumber])

	return (
		<>
			<NextSeo title={'お得なグループセール'} />

			<TopHeader isPage={false} />
			<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
				<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
					<h2 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 relative">
						新着グループセールアイテム
						<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#f087ff]  to-[#6e1fce] mb-2"></div>
					</h2>

					<DealItems dealItemsFromDynamo={dealItemsFromDynamo} />
					<DealPagination hasNextPage={!!LastEvaluatedKey} />
				</div>

				<Sidebar />
			</div>
			<Footer />
		</>
	)
}

export default GroupSalePage

export async function getServerSideProps(context) {
	const { res } = context
	res.setHeader('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=86400')

	const pageNumber = parseInt(context.query.number) || 1
	const lastEvaluatedKey = context.query.lastkey ? JSON.parse(decodeURIComponent(context.query.lastkey)) : null

	// 1ページ目の処理
	if (pageNumber === 1) {
		const dealItemsFromDynamo = await dynamoQueryDeal()

		return {
			props: {
				dealItemsFromDynamo: dealItemsFromDynamo.Items || [],
				LastEvaluatedKey: dealItemsFromDynamo.LastEvaluatedKey || null,
				pageNumber
			}
		}
	}

	// 2ページ目の処理
	if (pageNumber > 1) {
		if (lastEvaluatedKey) {
			// lastkey使って2ページ目以降のクエリ
			const dealItemsFromDynamo = await dynamoQueryDeal(lastEvaluatedKey)

			return {
				props: {
					dealItemsFromDynamo: dealItemsFromDynamo.Items || [],
					LastEvaluatedKey: dealItemsFromDynamo.LastEvaluatedKey || null,
					pageNumber
				}
			}
		} else {
			// lastEvaluatedKeyが無い場合の処理

			return {
				props: {
					dealItemsFromDynamo: [],
					LastEvaluatedKey: null,
					pageNumber,
					error: 'LastEvaluatedKeyが見つかりませんでした。'
				}
			}
		}
	}

	// MEMO どの条件にも当てはまらない場合の処理をreturnで記述しないと動かない
	console.log('無効なページナンバー')
	return {
		props: {
			dealItemsFromDynamo: [],
			LastEvaluatedKey: null,
			pageNumber,
			error: '無効なページナンバー'
		}
	}
}
