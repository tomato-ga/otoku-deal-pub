//  /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/page/[number].js

import { combineDataByAsin } from '@/funcs/combineASIN'

import { useEffect } from 'react'
import TopHeader from '@/components/TopHeader'
import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'

import Pagination from '@/components/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import PaginationContent from '@/components/PagenationContent'
import Footer from '@/components/Footer'

const Pages = ({ result, lastEvaluatedKey, pageNumber, hasMore }) => {
	console.log('Saving cookie for page:', pageNumber, 'with key:', lastEvaluatedKey) // ログ出力

	const showPagination = !result.endOfData
	console.log('showPagination', showPagination)

	// const typeData = result.items.filter((data) => data.type === '商品情報')
	// const combinebyAsin = combineDataByAsin(typeData)

	useEffect(() => {
		if (lastEvaluatedKey) {
			const existingKey = localStorage.getItem(`lastEvaluatedKey_page_${pageNumber}`)
			if (!existingKey) {
				const storageValue = JSON.stringify(lastEvaluatedKey)
				localStorage.setItem(`lastEvaluatedKey_page_${pageNumber}`, storageValue)
			}
		}
	}, [lastEvaluatedKey, pageNumber])

	return (
		<>
			<div className="flex flex-col min-h-screen">
				<TopHeader />
				<div className="flex-grow">
					<PaginationContent result={result} hasNextPage={lastEvaluatedKey} showPagination={showPagination} />
				</div>
				<Footer />
			</div>
		</>
	)
}

export default Pages

export async function getServerSideProps(context) {
	const { res } = context
	res.setHeader('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=86400')

	const pageNumber = parseInt(context.query.number) || 1
	const lastEvaluatedKey = context.query.lastkey ? JSON.parse(decodeURIComponent(context.query.lastkey)) : null

	console.log('ラストキー', lastEvaluatedKey)

	// DynamoDBクエリ関数を呼び出し
	const result = await dynamoQueryIndex(lastEvaluatedKey)

	// LastEvaluatedKeyの存在をチェック
	const hasMore = !!result.LastEvaluatedKey

	return {
		props: {
			result: result.Items || [], // 応答からアイテムを取得
			lastEvaluatedKey: hasMore ? result.LastEvaluatedKey : null, // LastEvaluatedKeyが存在する場合はそれを、そうでない場合はnullを設定
			pageNumber,
			hasMore
		}
	}
}
