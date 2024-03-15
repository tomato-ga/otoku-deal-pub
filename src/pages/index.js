// /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/index.js

import TopHeader from '@/components/TopHeader'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSidebarStore from '@/jotai/Store'

import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'
import { dynamoBestSellerQuery } from '@/funcs/BestsellerDynamodb'
import { dynamoQueryPriceoff } from '@/funcs/PriceoffItemsDynamodb'

import DealItems from '@/components/DealItemIndex'
import BestSellerItems from '@/components/Bestseller'

import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

import useIndexStore from '@/jotai/IndexStore'
import useDealStore from '@/jotai/DealStore'
import useLLMStore from '@/jotai/LLMStore'
import { dynamoPriceoffQuery } from '@/funcs/NewPriceoffItemsDynamodb'
import { dynamoQueryLlmflagTrue } from '@/funcs/LLMflagindexDynamodb'
import LLMItems from '../components/LLMItemIndex'
import PostsGrid from '@/components/PostGrid'

export default function Home({
	result,
	lastEvaluatedKey,
	llmresult,
	pageNumber,
	bestSellerBooksFromDynamo,
	bestSellerVideoGamesFromDynamo,
	bestSellerPCFromDynamo
	// priceOffItems
}) {
	const { lastKeyList, setLastKeyList } = useIndexStore()
	const { deallastKeyList, dealsetLastKeyList } = useDealStore()
	const [dealResult, setDealResult] = useState([])

	const { llmlastKeyList, llmsetLastKeyList } = useLLMStore()
	const [llmResult, setllmResult] = useState([])

	const router = useRouter()
	let number = 1

	// Deal API
	useEffect(() => {
		const fetchData = async () => {
			try {
				// const lastKey = deallastKeyList[`lastkey_deal_page_${number - 1}`]
				// const encodedLastKey = lastKey ? encodeURIComponent(JSON.stringify(lastKey)) : ''
				const url = `/api/dealnumber`
				const response = await fetch(url)
				if (!response.ok) throw new Error('DealNumberPages fetchエラー')
				const result = await response.json()

				setDealResult(result.Items)
				dealsetLastKeyList(number, result.LastKey)
			} catch (error) {
				console.error('エラー', error)
			}
		}
		fetchData()
	}, [])

	// LLM API
	useEffect(() => {
		const fetchData = async () => {
			try {
				// const lastKey = deallastKeyList[`lastkey_deal_page_${number - 1}`]
				// const encodedLastKey = lastKey ? encodeURIComponent(JSON.stringify(lastKey)) : ''
				const url = `/api/llmflag`
				const response = await fetch(url)
				if (!response.ok) throw new Error('LLM Flag fetchエラー')
				const result = await response.json()

				setllmResult(result.Items)
				llmsetLastKeyList(number, result.LastKey)
			} catch (error) {
				console.error('エラー', error)
			}
		}
		fetchData()
	}, [])

	useEffect(() => {
		if (lastEvaluatedKey) {
			setLastKeyList(pageNumber, lastEvaluatedKey)
		}
	}, [lastEvaluatedKey, pageNumber])

	// MEMO オリジナルコンテンツ取得API
	const [postLists, setPostLists] = useState([])

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/admin_originContentFromSQL', {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})
				if (response.ok) {
					const sqldata = await response.json()
					setPostLists(sqldata.data)
				} else {
					console.error('Failed to fetch data:', response.status)
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		fetchData()
	}, [])

	// const sidebarOpen = useSidebarStore((state) => state.sidebarOpen)
	// const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)

	const calculateOriginalPrice = (price, priceOff) => {
		const parsedPrice = parseInt(price.replace('￥', '').replace(',', ''), 10)
		const discountRate = parseFloat(priceOff.replace('-', '').replace('%', '')) / 100
		return `￥${Math.round(parsedPrice / (1 - discountRate)).toLocaleString()}`
	}

	const truncateString = (str, num) => {
		// strがundefinedまたはnullである場合、または文字列でない場合に空文字列を返す
		if (typeof str !== 'string') {
			return ''
		}

		if (str.length <= num) {
			return str
		}
		return str.slice(0, num) + '...'
	}

	const extractAsin = (value) => {
		return value.replace('ASIN#', '')
	}

	const trackClick = (asindata) => {
		window.dataLayer = window.dataLayer || []
		dataLayer.push({
			event: 'index_to_page_click',
			ASIN: asindata.asin?.S.replace('ASIN#', ''),
			category: asindata.categoryName?.S
		})
	}

	// MEMO 割引率が一桁のアイテムは除外する
	// const priceOfflimitItems = (priceOffItemList) => {
	// 	let priceOfflimitOnItems = []

	// 	priceOffItemList.forEach((item) => {
	// 		if (item.priceOff && typeof item.priceOff.S === 'string') {
	// 			const priceOffValue = parseInt(item.priceOff.S.replace('%', '').replace('-', ''), 10)

	// 			// ここでの条件を確認してください
	// 			if (!isNaN(priceOffValue) && priceOffValue >= 10) {
	// 				priceOfflimitOnItems.push({ ...item, priceOffValue })
	// 			}
	// 		}
	// 	})
	// 	// 割引率の高い順に並べ替える
	// 	priceOfflimitOnItems.sort((a, b) => b.priceOffValue - a.priceOffValue)
	// 	return priceOfflimitOnItems
	// }

	const handleNextPage = () => {
		if (lastEvaluatedKey) {
			router.push(`/page/2`)
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	// console.log('priceOfflimitItems', priceOffItems)
	// console.log('priceOfflimitItems', priceOfflimitItems(priceOffItems))

	const today = new Date()
	const formattedToday =
		today.getFullYear() +
		'-' +
		(today.getMonth() + 1).toString().padStart(2, '0') +
		'-' +
		today.getDate().toString().padStart(2, '0')

	return (
		<>
			<TopHeader />

			{/* オリジナルコンテンツ */}

			<PostsGrid postLists={postLists.slice(0, 3)} />

			{/* 最新セール情報 */}
			<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
				{/* Main content */}
				<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
					<div className="flex justify-center relative">
						<div className="content-center font-extrabold text-4xl bg-gradient-to-r from-pink-400 to-violet-900 bg-clip-text text-transparent">
							最新セール情報
						</div>
					</div>

					<LLMItems LLMItemsfromDynamo={llmresult} />

					{/* 割引率の表示を一時停止 / 2024/03/15 */}
					{/* <div className="relative">
						<h2 className="text-4xl font-bold pt-3 pr-3 pb-3 pl-1 mt-10 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text">
							割引率が高いアイテム
							<div className="absolute bottom-0 left-0 w-full h-0.5  bg-gradient-to-r from-slate-300 to-slate-200  mb-2"></div>
						</h2>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white mt-6">
						{priceOfflimitItems(priceOffItems)
							.slice(0, 10)
							.map((data) => (
								<Link
									href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`}
									key={data.asin.S}
									prefetch={false}
									onClick={() => trackClick(data)}
								>
									<div className="border p-2 bg-white flex flex-col h-full cursor-pointer">
										<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
											<img
												src={data.imageUrl?.S}
												alt={data.productName?.S}
												className="w-full max-h-[270px] object-contain"
											/>
										</div>
										<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
											{truncateString(data.productName?.S, 50)}
										</h2>
										<div className="mt-auto">
											<div className="flex">
												{data.priceOff.S && (
													<p className="text-lg md:text-2xl font-bold text-red-600 px-2">{data.priceOff.S}</p>
												)}
												<p className="text-lg md:text-2xl font-bold text-gray-700 px-2">{data.price.S}</p>
											</div>
											{data.priceOff && (
												<div className="flex">
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
					</div> */}

					<div className="relative">
						<h2 className="text-4xl font-bold pt-3 pr-3 pb-3 pl-1 mt-10 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text">
							新着セールアイテム
							<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 mb-2"></div>
						</h2>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white mt-6">
						{result.map((data) => (
							<div className="size-40 relative overflow-hidden rounded-lg">
								{data.date.S === formattedToday && (
									<div className="absolute w-full top-0 -left-1/2 pt-4 origin-top -rotate-45">
										<div className="grid place-content-center text-sm bg-red-400 text-white py-1">NEW</div>
									</div>
								)}
								<Link
									href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`}
									key={data.asin.S}
									prefetch={false}
									onClick={() => trackClick(data)}
								>
									<div className="border p-2 bg-white flex flex-col h-full cursor-pointer">
										<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
											<img
												src={data.imageUrl?.S}
												alt={data.productName?.S}
												className="w-full max-h-[270px] object-contain"
											/>
										</div>
										<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
											{truncateString(data.productName?.S, 50)}
										</h2>
										<div className="mt-auto">
											<div className="flex">
												{data.priceOff.S && (
													<p className="text-lg md:text-2xl font-bold text-red-600 px-2">{data.priceOff.S}</p>
												)}
												<p className="text-lg md:text-2xl font-bold text-gray-700 px-2">{data.price.S}</p>
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
							</div>
						))}
					</div>

					{lastEvaluatedKey && (
						<div className="flex items-center justify-center">
							<Link href={`/page/2`}>
								<button
									onClick={handleNextPage}
									className="flex items-center justify-center px-4 py-2 w-40 h-14 mt-4 ml-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
				bg-gradient-to-r from-[#FF7EC7] to-[#FFED46]"
								>
									次のページ
								</button>
							</Link>
						</div>
					)}

					<DealItems dealItemsFromDynamo={dealResult} />

					<div className="flex items-center justify-center">
						<Link href="/group/page/2" prefetch={false}>
							<button
								className="flex items-center justify-center px-4 py-2 w-80 h-14 ml-2 mt-4 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
						bg-gradient-to-r from-[#B7DCFF] to-[#FFA4F6]"
							>
								グループセール一覧
							</button>
						</Link>
					</div>

					<BestSellerItems bestSellerFromDynamo={bestSellerBooksFromDynamo} />
					<BestSellerItems bestSellerFromDynamo={bestSellerVideoGamesFromDynamo} />
					<BestSellerItems bestSellerFromDynamo={bestSellerPCFromDynamo} />
				</div>

				{/* Sidebar */}
				<Sidebar />
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
	const llmresult = await dynamoQueryLlmflagTrue()

	// Amazon.co.jp: のプレフィックスを削除
	// const removeAmazonPrefix = (productName) => {
	// 	return productName.replace(/^Amazon\.co\.jp:\s*/, '')
	// }

	// // プロダクト名からAmazon.co.jp: を削除
	// if (ProductasinFetchFromDynamo.Items[0] && ProductasinFetchFromDynamo.Items[0].productName) {
	// 	ProductasinFetchFromDynamo.Items[0].productName.S = removeAmazonPrefix(
	// 		ProductasinFetchFromDynamo.Items[0].productName.S
	// 	)
	// }

	// /dealごとのDynamoDB直クエリ
	// const dealItemsFromDynamo = await dynamoQueryDeal()

	const bestSellerBooksFromDynamo = await dynamoBestSellerQuery('https://www.amazon.co.jp/gp/bestsellers/books/')
	const bestSellerVideoGamesFromDynamo = await dynamoBestSellerQuery(
		'https://www.amazon.co.jp/gp/bestsellers/videogames/'
	)
	const bestSellerPCFromDynamo = await dynamoBestSellerQuery('https://www.amazon.co.jp/gp/bestsellers/computers/')
	// const newpriceOffitems = await dynamoPriceoffQuery()

	return {
		props: {
			result: result.Items || [],
			llmresult: llmresult.Items || [],
			lastEvaluatedKey: result.LastEvaluatedKey || null,
			pageNumber,
			// dealItemsFromDynamo: dealItemsFromDynamo.Items || [],
			bestSellerBooksFromDynamo,
			bestSellerVideoGamesFromDynamo,
			bestSellerPCFromDynamo
			// priceOffItems: newpriceOffitems || []
		}
	}
}
