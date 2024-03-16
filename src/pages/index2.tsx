// /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/index2.tsx

import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb'

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

interface Item {
	productName: string
	price: number
}

interface DynamoDBQueryResult<T> {
	Items: T[]
	LastEvaluatedKey?: { [key: string]: any } | null
}

interface ServerSideProps {
	result: DynamoDBQueryResult<Item>
	lastEvaluatedKey: { [key: string]: any } | null
	llmresult: DynamoDBQueryResult<Item>
	pageNumber: number
	bestSellerBooksFromDynamo: any
	bestSellerVideoGamesFromDynamo: any
	bestSellerPCFromDynamo: any
	priceOffItems: any[]
}

// DynamoDBからのQueryCommandOutputをDynamoDBQueryResult<Item>に変換する関数
function convertQueryOutputToDynamoDBQueryResult(queryOutput: QueryCommandOutput): DynamoDBQueryResult<Item> {
	const items: Item[] =
		queryOutput.Items?.map((item) => ({
			productName: item.productName.S, // DynamoDBの属性が文字列型の場合の例
			price: Number(item.price.N) // DynamoDBの属性が数値型の場合の例
		})) || []

	return {
		Items: items,
		LastEvaluatedKey: queryOutput.LastEvaluatedKey || null
	}
}

export default function Home({ result, lastEvaluatedKey, llmresult, pageNumber }: ServerSideProps) {
	const { lastKeyList, setLastKeyList } = useIndexStore()
	const { deallastKeyList, dealsetLastKeyList } = useDealStore()
	const [dealResult, setDealResult] = useState<any[]>([])

	const { llmlastKeyList, llmsetLastKeyList } = useLLMStore()
	const [llmResult, setllmResult] = useState<any[]>([])

	const router = useRouter()
	let number = 1

	// LLM API
	useEffect(() => {
		const fetchData = async () => {
			try {
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

	// MEMO オリジナルコンテンツ取得API
	const [postLists, setPostLists] = useState<any[]>([])

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

	return
}

export async function getServerSideProps(context: any) {
	const { res } = context
	res.setHeader('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=86400')

	const pageNumber = parseInt(context.query.number) || 1

	// dynamoQueryIndex関数の呼び出し
	const queryResult = await dynamoQueryIndex()

	// queryResultがQueryCommandOutput型であるかチェック
	if (!Array.isArray(queryResult)) {
		const result: DynamoDBQueryResult<Item> = convertQueryOutputToDynamoDBQueryResult(queryResult)

		const llmQueryResult = await dynamoQueryLlmflagTrue()
		// llmQueryResultがQueryCommandOutput型であるかチェック
		if (!Array.isArray(llmQueryResult)) {
			const llmresult: DynamoDBQueryResult<Item> = convertQueryOutputToDynamoDBQueryResult(llmQueryResult)

			return {
				props: {
					result,
					llmresult,
					lastEvaluatedKey: result.LastEvaluatedKey || null,
					pageNumber
				}
			}
		}
	}

	// queryResultまたはllmQueryResultが期待する型ではない場合（ここでは空の配列を返す例を示しますが、実際には適切なエラーハンドリングを行ってください）
	return {
		props: {
			result: { Items: [], LastEvaluatedKey: null },
			llmresult: { Items: [], LastEvaluatedKey: null },
			lastEvaluatedKey: null,
			pageNumber
		}
	}
}
