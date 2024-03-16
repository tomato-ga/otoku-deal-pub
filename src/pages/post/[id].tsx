import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import TopHeader from '@/components/TopHeader'
import Itemspagenavbar from '@/components/ItemsPage3navbar'
import MarkdownContent from '@/components/markdowncontent'
import Footer from '@/components/Footer'
import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'


interface PostContent {
	id: string
	title: string
	content: string
	created_at: string
	tags: string[]
}

interface SaleItem {
	categoryName: string
	asin: string
	llmflag: string
	time: string
	descripText: string
	dealUrlExists: string
	datePriceOff: string // DynamoDBの属性名には#が含まれているが、これを適切なJavaScript/TypeScriptの識別子に変更
	dealUrl: string
	date: string
	imageUrl: string
	llmtitle: string
	dealName: string
	dateAsin: string // 同上
	affUrl: string
	priceOff: string
	llmcontent: string
	price: string
	dateDealUrl: string // 同上
	productName: string
	type: string
}

interface PostPageProps {
	post: PostContent
	latestsale: SaleItem[]
}

const Post: React.FC<PostPageProps> = ({ post, latestsale }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	const extractAsin = (value: string) => {
		if (!value) {
			return ''
		}
		return value.replace('ASIN#', '')
	}

	return (
		<>
			<TopHeader />
			<Itemspagenavbar />


			<div className='max-w-screen-md mx-auto'>		
			<div className="flex justify-center items-center m-6 text-center">
				<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text border-solid border-b border-gray-200 pb-4">
					{post.title}
				</h1>
			</div>

			<div className="m-6">
				<MarkdownContent markdownString={post.content} />
			</div>
			

			{/* インデックスの最新情報 */}
			<h2 className="text-gray-500 mt-3 mb-3 text-center text-2xl font-bold">最新セール情報</h2>
			<div className="h-0.5 bg-gradient-to-r from-[#d299c2] to-[#fef9d7] ml-10 mr-10"></div>
			<div className="flex flex-col md:flex-row bg-white p-4">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
					{latestsale.slice(0, 8).map((item, index) => (
						<div className="text text-black" key={index}>
							<Link href={`/items/${item.date}/${extractAsin(item.asin)}`} prefetch={false}>
								<div className="h-[270px] w-full md:h-[270px] md:w-full mb-4">
									<img
										src={item.imageUrl}
										alt={item.productName}
										className="w-full h-full"
										style={{ objectFit: 'contain' }}
									/>
								</div>
								<div className="mr-2 ml-2">
									<p>{item.productName.length > 80 ? `${item.productName.substring(0, 80)}...` : item.productName}</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
			</div>
			<Footer />
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	// context.paramsがundefinedでないことを確認し、idをstring型で取得します。
	const id = context.params?.id

	// idが存在しない、または配列の場合はエラーを返します。
	if (!id || Array.isArray(id)) {
		return {
			props: {
				error: 'Invalid id'
			}
		}
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
	// 実際の環境では、外部APIを呼び出すURLや環境変数を適切に設定してください。
	const res = await fetch(`${baseUrl}/api/admin_getpostcontent?id=${id}`)
	const data = await res.json()

	// 最新のセール情報
	const result = await dynamoQueryIndex()
	// resultがQueryCommandOutput型であることを確認し、さらにItemsプロパティを持っているかチェック
	if ('Items' in result && Array.isArray(result.Items)) {
		const items: SaleItem[] = result.Items.map((item) => ({
			categoryName: item.categoryName?.S ?? '',
			asin: item.asin?.S ?? '',
			llmflag: item.llmflag?.S ?? '',
			time: item.time?.S ?? '',
			descripText: item.descripText?.S ?? '',
			dealUrlExists: item.dealUrlExists?.S ?? '',
			datePriceOff: item['date#priceOff']?.S ?? '',
			dealUrl: item.dealUrl?.S ?? '',
			date: item.date?.S ?? '',
			imageUrl: item.imageUrl?.S ?? '',
			llmtitle: item.llmtitle?.S ?? '',
			dealName: item.dealName?.S ?? '',
			dateAsin: item['date#asin']?.S ?? '',
			affUrl: item.affUrl?.S ?? '',
			priceOff: item.priceOff?.S ?? '',
			llmcontent: item.llmcontent?.S ?? '',
			price: item.price?.S ?? '',
			dateDealUrl: item['date#dealUrl']?.S ?? '',
			productName: item.productName?.S ?? '',
			type: item.type?.S ?? ''
		}))

		// APIから取得したデータをpropsとしてページに渡す
		return { props: { post: data.data, latestsale: items } }
	} else {
		// Itemsプロパティがない場合のエラーハンドリング
		console.error("The result doesn't have an Items property.")
		return { props: { error: 'Failed to fetch latest sales information.' } }
	}
}

export default Post
