//  /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/tag/[tagpage]/page/[number].js

import TopHeader from '@/components/TopHeader'
import Sidebar from '@/components/Sidebar'

import CategoryItems from '@/components/CategoryItemIndex'
import Footer from '@/components/Footer'
import { NextSeo } from 'next-seo'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useCategoryStore from '@/jotai/CategoryStore'


const CategoryPages = () => {
	const router = useRouter()
	const { categoryname, number } = router.query

	const [categoryResult, setCategoryResult] = useState([])
	const { lastKeyList, setLastKeyList } = useCategoryStore()

	useEffect(() => {
		if (categoryname && number) {
			const fetchData = async () => {
				try {
					// 現在のページ番号に基づいてlastKeyを取得
					const lastKey = lastKeyList[`lastkey_category_page_${categoryname}_${number - 1}`]
					const encodedLastKey = lastKey ? encodeURIComponent(JSON.stringify(lastKey)) : ''
					const url = `/api/categorynumberpages?categoryname=${encodeURIComponent(
						categoryname
					)}&lastkey=${encodedLastKey}`
					const response = await fetch(url)

					if (!response.ok) throw new Error('CategoryPages fetchエラー')
					const result = await response.json()

					setCategoryResult(result.Items)
					// 次のページのためにlastKeyを保存
					setLastKeyList(categoryname, number, result.LastKey)
					// console.log(`[Fetch後] lastKeyList更新: ${categoryname}, ${number}, ${JSON.stringify(result.LastKey)}`)
				} catch (error) {
					console.error('エラー', error)
				}
			}
			fetchData()
		}
	}, [categoryname, number]) // 依存配列に lastKeyList と setLastKeyList を含めない

	const currentPage = Number(number)
	const hasNextPage = !!lastKeyList[`lastkey_category_page_${categoryname}_${number}`] // 次のページのlastKeyが存在するか
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1

	const handlePrevPage = () => {
		if (currentPage > 1) {
			router.push(`/category/${categoryname}/page/${prevPage}`)
		}
	}

	const handleNextPage = () => {
		if (hasNextPage) {
			router.push(`/category/${categoryname}/page/${nextPage}`)
		}
	}

	return (
		<>
			{/* データ表示 */}

			<NextSeo title={categoryname} />

			<div className="flex flex-col min-h-screen">
				<TopHeader isPage={false} />
				<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
					<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
						<h2 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 relative">
							{categoryname}のセールアイテム
							<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#f087ff]  to-[#6e1fce] mb-2"></div>
						</h2>

						<CategoryItems categoryFromDynamo={categoryResult} />

						{/* ページネーションボタン */}
						<div>
							<ul className="inline-flex -space-x-px text-base h-10 pt-10">
								{currentPage > 1 && (
									<Link href={`/category/${categoryname}/page/${prevPage}`}>
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
									<Link href={`/category/${categoryname}/page/${nextPage}`}>
										<button
											onClick={handleNextPage}
											className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
							bg-gradient-to-r from-[#B7DCFF] to-[#FFA4F6]"
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
export default CategoryPages
