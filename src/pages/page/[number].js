//  /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/page/[number].js

import { useEffect, useState } from 'react'
import TopHeader from '@/components/TopHeader'

import Pagination from '@/components/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import IndexPaginationItems from '@/components/PagenationContent'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'
import useIndexStore from '@/jotai/IndexStore'

import { NextSeo } from 'next-seo'
import Sidebar from '@/components/Sidebar'

const Pages = () => {
	const router = useRouter()
	const { number } = router.query

	const [indexResult, setIndexResult] = useState([])
	const { lastKeyList, setLastKeyList } = useIndexStore()

	useEffect(() => {
		if (number) {
			const fetchData = async () => {
				try {
					const lastKey = lastKeyList[`lastkey_index_page_${number - 1}`]
					const encodedLastKey = lastKey ? encodeURIComponent(JSON.stringify(lastKey)) : ''
					const url = `/api/indexnumber?lastkey=${encodedLastKey}`
					const response = await fetch(url)
					if (!response.ok) throw new Error('IndexNumberPages fetchエラー')
					const result = await response.json()

					setIndexResult(result.Items)
					setLastKeyList(number, result.LastKey)
				} catch (error) {
					console.error('エラー', error)
				}
			}
			fetchData()
		}
	}, [number])

	const currentPage = Number(number)
	const hasNextPage = !!lastKeyList[`lastkey_index_page_${number}`] // 次のページのlastKeyが存在するか

	const nextPage = currentPage + 1
	const prevPage = currentPage - 1

	const handlePrevPage = () => {
		if (currentPage > 1) {
			router.push(`/page/${prevPage}`)
		}
	}

	const handleNextPage = () => {
		if (hasNextPage) {
			router.push(`/page/${nextPage}`)
		}
	}

	return (
		<>
			{/* データ表示 */}

			<NextSeo title={''} />

			<div className="flex flex-col min-h-screen">
				<TopHeader isPage={false} />
				<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
					<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
						<h2 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 relative">
							新着セールアイテム
							<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#f087ff]  to-[#6e1fce] mb-2"></div>
						</h2>

						<IndexPaginationItems result={indexResult} />

						{/* ページネーションボタン */}
						<div className="flex items-center justify-center">
							<ul className="inline-flex -space-x-px text-base h-10 pt-10">
								{currentPage > 1 && (
									<Link href={`/page/${prevPage}`}>
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
									<Link href={`/page/${nextPage}`}>
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
			</div>
		</>
	)
}

export default Pages
