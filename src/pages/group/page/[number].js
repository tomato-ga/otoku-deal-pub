import Link from 'next/link'
import { useEffect, useState } from 'react'

import TopHeader from '@/components/TopHeader'
import DealItems from '@/components/DealItemIndex'
import DealPagination from '@/components/DealPagination'

import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { NextSeo } from 'next-seo'

import useDealStore from '@/jotai/DealStore'
import { useRouter } from 'next/router'

const GroupSalePage = () => {
	const router = useRouter()
	const { number } = router.query

	const [dealResult, setDealResult] = useState([])
	const { deallastKeyList, dealsetLastKeyList } = useDealStore()

	useEffect(() => {
		if (number) {
			const fetchData = async () => {
				try {
					// 現在のlastKeyを取得
					const lastKey = deallastKeyList[`lastkey_deal_page_${number - 1}`]

					// lastKeyをエンコード
					const encodedLastKey = lastKey ? encodeURIComponent(JSON.stringify(lastKey)) : ''
					const url = `/api/dealnumber?lastkey=${encodedLastKey}`

					// APIリクエスト
					const response = await fetch(url)
					if (!response.ok) throw new Error('IndexNumberPages fetchエラー')
					const result = await response.json()

					// 結果の設定とlastKeyの保存
					setDealResult(result.Items)
					dealsetLastKeyList(number, result.LastKey)
				} catch (error) {
					console.error('エラー', error)
				}
			}
			fetchData()
		}
	}, [number])

	const currentPage = Number(number)
	const hasNextPage = !!deallastKeyList[`lastkey_deal_page_${number}`] // 次のページのlastKeyが存在するか

	const prevPage = currentPage - 1
	const nextPage = currentPage + 1

	const handlePrevPage = () => {
		if (currentPage > 1) {
			router.push(`/group/page/${prevPage}`)
		}
	}

	const handleNextPage = () => {
		if (hasNextPage) {
			router.push(`/group/page/${nextPage}`)
		}
	}

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

					<DealItems dealItemsFromDynamo={dealResult} />
					{/* ページネーションボタン */}
					<div className="flex items-center justify-center mt-3 mb-3">
						<ul className="inline-flex -space-x-px text-base h-10 pt-10">
							{currentPage > 1 && (
								<Link href={`/group/page/${prevPage}`}>
									<button
										onClick={handlePrevPage}
										className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-0 mr-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
							bg-gradient-to-r from-[#FFED46] to-[#FF7EC7]"
									>
										前のページ
									</button>
								</Link>
							)}
							{hasNextPage && (
								<Link href={`/group/page/${nextPage}`}>
									<button
										onClick={handleNextPage}
										className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
							bg-gradient-to-r from-[#FF7EC7] to-[#FFED46]"
									>
										次のページ
									</button>
								</Link>
							)}
						</ul>
					</div>
				</div>

				<Sidebar />
			</div>
			<Footer />
		</>
	)
}

export default GroupSalePage
