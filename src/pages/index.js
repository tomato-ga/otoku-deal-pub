// /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/index.js

import { combineDataByAsin } from '@/funcs/combineASIN'

import TopHeader from '@/components/TopHeader'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Pagination from '@/components/Pagination'
import useSidebarStore from '@/jotai/Store'

import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'
import { dynamoQueryDeal } from '@/funcs/DealIndexDynamodb'
import { dynamoBestSellerQuery } from '@/funcs/BestsellerDynamodb'
import DealItems from '@/components/DealItemIndex'
import BestSellerItems from '@/components/Bestseller'

import SideCategoryLinks from '@/components/SideCategoryLinks'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

export default function Home({
	result,
	lastEvaluatedKey,
	pageNumber,
	hasMore,
	dealItemsFromDynamo,
	bestSellerBooksFromDynamo,
	bestSellerVideoGamesFromDynamo,
	bestSellerPCFromDynamo
}) {
	useEffect(() => {
		if (lastEvaluatedKey) {
			const storageValue = JSON.stringify(lastEvaluatedKey)
			localStorage.setItem(`lastEvaluatedKey_page_${pageNumber}`, storageValue)
		}
	}, [lastEvaluatedKey, pageNumber])

	const sidebarOpen = useSidebarStore((state) => state.sidebarOpen)
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)

	const calculateOriginalPrice = (price, priceOff) => {
		const parsedPrice = parseInt(price.replace('￥', '').replace(',', ''), 10)
		const discountRate = parseFloat(priceOff.replace('-', '').replace('%', '')) / 100
		return `￥${Math.round(parsedPrice / (1 - discountRate)).toLocaleString()}`
	}

	const truncateString = (str, num) => {
		if (str.length <= num) {
			return str
		}
		return str.slice(0, num) + '...'
	}

	const extractAsin = (value) => {
		return value.replace('ASIN#', '')
	}

	const trackClick = (asindata) => {
		// Google Analytics イベントを送信
		window.gtag('event', 'imp_Click', {
			event_category: `${asindata.categoryName.S}`,
			event_label: `${asindata.asin.S}`
		})
	}

	return (
		<>
			<TopHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

			<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
				{/* Main content */}
				<div className="w-full sm:w-1/2 md:w-3/4 p-4 bg-white order-1 md:order-2">
					<h2 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 relative">
						新着セールアイテム
						<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#f087ff]  to-[#6e1fce] mb-2"></div>
					</h2>

					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white mt-6">
						{result.map((data) => (
							<Link
								href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`}
								key={data.asin.S}
								prefetch={false}
								onClick={() => trackClick(data)}
							>
								<div className="border p-2 bg-white flex flex-col h-full cursor-pointer">
									<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
										<img
											src={data.imageUrl.S}
											alt={data.productName.S}
											className="w-full max-h-[270px] object-contain"
										/>
									</div>
									<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
										{truncateString(data.productName.S, 50)}
									</h2>
									<div className="mt-auto">
										<div className="flex">
											{data.priceOff.S && (
												<p className="text-lg md:text-2xl font-bold text-red-600 px-2">{data.priceOff.S}</p>
											)}
											<p className="text-lg md:text-2xl font-bold text-gray-700 px-2 ">{data.price.S}</p>
										</div>
										{data.priceOff && (
											<div className="flex ">
												<p className="text-sm font-light text-gray-700 px-2">過去価格:</p>
												<p className="text-sm font-light text-gray-700 px-2 line-through">
													{calculateOriginalPrice(data.price.S, data.priceOff.S)}
												</p>
											</div>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
					<Pagination hasNextPage={!!lastEvaluatedKey} />

					<DealItems dealItemsFromDynamo={dealItemsFromDynamo} />
					<BestSellerItems bestSellerFromDynamo={bestSellerBooksFromDynamo} />
					<BestSellerItems bestSellerFromDynamo={bestSellerVideoGamesFromDynamo} />
					<BestSellerItems bestSellerFromDynamo={bestSellerPCFromDynamo} />
				</div>

				{/* Sidebar */}
				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
			</div>
			<Footer />
		</>
	)
}

export async function getServerSideProps(context) {
	const { res } = context
	res.setHeader('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=86400')

	const pageNumber = parseInt(context.query.number) || 1

	// DynamoDBクエリ関数を呼び出し
	const result = await dynamoQueryIndex()

	// LastEvaluatedKeyの存在をチェック
	const hasMore = !!result.LastEvaluatedKey

	// /dealごとのDynamoDB直クエリ
	const dealItemsFromDynamo = await dynamoQueryDeal()

	const bestSellerBooksFromDynamo = await dynamoBestSellerQuery('https://www.amazon.co.jp/gp/bestsellers/books/')
	const bestSellerVideoGamesFromDynamo = await dynamoBestSellerQuery(
		'https://www.amazon.co.jp/gp/bestsellers/videogames/'
	)
	const bestSellerPCFromDynamo = await dynamoBestSellerQuery('https://www.amazon.co.jp/gp/bestsellers/computers/')

	return {
		props: {
			result: result.Items || [],
			lastEvaluatedKey: hasMore ? result.LastEvaluatedKey : null,
			pageNumber,
			hasMore,
			dealItemsFromDynamo: dealItemsFromDynamo.Items || [],
			bestSellerBooksFromDynamo,
			bestSellerVideoGamesFromDynamo,
			bestSellerPCFromDynamo
		}
	}
}
