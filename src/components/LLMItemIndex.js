import Link from 'next/link'
import React from 'react'

const LLMItem = ({ data }) => {
	// 文字列を短縮する関数
	const truncateString = (str, num) => {
		// '*'を削除
		const cleanedString = str.replace(/\*/g, '')

		// 文字列がnum以下の長さであればそのまま返す
		if (cleanedString.length <= num) {
			return cleanedString
		}

		// 文字列がnumより長い場合は、num文字で切り詰めて'...'を追加
		return cleanedString.slice(0, num) + '...'
	}

	// ASINを抽出する関数
	const extractAsin = (value) => {
		return value.replace('ASIN#', '')
	}

	// 元の価格を計算する関数
	const calculateOriginalPrice = (price, priceOff) => {
		const parsedPrice = parseInt(price.replace('￥', '').replace(',', ''), 10)
		const discountRate = parseFloat(priceOff.replace('-', '').replace('%', '')) / 100
		return `￥${Math.round(parsedPrice / (1 - discountRate)).toLocaleString()}`
	}

	return (
		<div className="border p-2 bg-white flex flex-col h-full">
			<Link href={`/items/${data.date}/${extractAsin(data.asin)}`}>
				<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
					<img src={data.imageUrl} alt={data.productName} className="w-full max-h-[270px] object-contain" />
				</div>
				<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
					{truncateString(data.llmtitle, 50)}
				</h2>
				<div className="mt-auto">
					<div className="flex">
						{data.priceOff && <p className="text-lg md:text-2xl font-bold text-red-600 px-2">{data.priceOff}</p>}
						<p className="text-lg md:text-2xl font-bold text-gray-700 px-2">{data.price}</p>
					</div>
					{data.priceOff && (
						<div className="flex">
							<p className="text-sm font-light text-gray-700 px-2">過去価格:</p>
							<p className="text-sm font-light text-gray-700 px-2 line-through">
								{calculateOriginalPrice(data.price, data.priceOff)}
							</p>
						</div>
					)}
				</div>
			</Link>
		</div>
	)
}

// DynamoDBアイテムから単純な値を抽出する関数
const extractSimpleValuesFromDynamoDBItem = (dynamoDbItem) => {
	let plainObject = {}
	for (const [key, valueObj] of Object.entries(dynamoDbItem)) {
		const valueKey = Object.keys(valueObj).find((k) => ['S', 'N', 'B', 'BOOL'].includes(k))
		plainObject[key] = valueObj[valueKey]
	}
	return plainObject
}

// LLMコンテンツ表示
const LLMItems = ({ LLMItemsfromDynamo }) => {
	// DynamoDBアイテムを単純な値のオブジェクトに変換
	let plainArray = Object.values(LLMItemsfromDynamo)
		.flat()
		.map((item) => extractSimpleValuesFromDynamoDBItem(item))

	// アイテムをグループ化する関数
	const groupedByH1 = plainArray.reduce((group, item) => {
		const dealName = item.dealName || 'おすすめガジェット'
		if (!group[dealName]) {
			group[dealName] = []
		}
		group[dealName].push(item)
		return group
	}, {})

	return (
		<>
			{Object.entries(groupedByH1).map(([h1Value, items]) => (
				<div key={h1Value} className="deal-item">
					<div className="relative">
						<h2 className="text-4xl font-bold pt-3 pr-3 pb-3 pl-1 mt-10 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text">
							{h1Value}
						</h2>
						<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1fcff1] to-[#234cb6] mb-2"></div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white mt-6">
						{items.map((item) => (
							<div key={item.asin}>
								<LLMItem data={item} />
							</div>
						))}
					</div>
				</div>
			))}
		</>
	)
}

export default LLMItems
