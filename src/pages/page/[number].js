//  /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/page/[number].js

import { useEffect, useState } from 'react'
import TopHeader from '@/components/TopHeader'

import Pagination from '@/components/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import PaginationContent from '@/components/PagenationContent'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'
import useIndexStore from '@/jotai/IndexStore'

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
					const url = `/api/categorynumberpages?lastkey=${encodedLastKey}`
					const response = await fetch(url)
					if (!response.ok) throw new Error('CategoryPages fetchエラー')
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

	// useEffect(() => {
	// 	if (lastEvaluatedKey) {
	// 		const existingKey = localStorage.getItem(`lastEvaluatedKey_page_${pageNumber}`)
	// 		if (!existingKey) {
	// 			const storageValue = JSON.stringify(lastEvaluatedKey)
	// 			localStorage.setItem(`lastEvaluatedKey_page_${pageNumber}`, storageValue)
	// 		}
	// 	}
	// }, [lastEvaluatedKey, pageNumber])

	return (
		<>
			<div className="flex flex-col min-h-screen">
				<TopHeader />
				<div className="flex-grow">
					<PaginationContent result={indexResult} hasNextPage={lastEvaluatedKey} showPagination={showPagination} />
				</div>
				<Footer />
			</div>
		</>
	)
}

export default Pages
