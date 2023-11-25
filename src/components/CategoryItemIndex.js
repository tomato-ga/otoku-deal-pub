import Link from 'next/link'
import React from 'react'

const CategoryItem = ({ data }) => {
	console.log('CategoryItem', data)

	const truncateString = (str, num) => {
		if (str.length <= num) {
			return str
		}
		return str.slice(0, num) + '...'
	}

	const extractAsin = (value) => {
		return value.replace('ASIN#', '')
	}

	const calculateOriginalPrice = (price, priceOff) => {
		const parsedPrice = parseInt(price.replace('￥', '').replace(',', ''), 10)
		const discountRate = parseFloat(priceOff.replace('-', '').replace('%', '')) / 100
		return `￥${Math.round(parsedPrice / (1 - discountRate)).toLocaleString()}`
	}

	return (
		<div key={data.asin.S} className="border p-2 bg-white flex flex-col h-full">
			<Link href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`}>
				<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
					<img src={data.imageUrl.S} alt={data.productName.S} className="w-full max-h-[270px] object-contain" />
				</div>
				<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
					{truncateString(data.productName.S, 50)}
				</h2>
				<div className="mt-auto">
					<div className="flex items-center">
						{data.priceOff.S && <p className="text-xl font-bold text-red-600 px-2">{data.priceOff.S}</p>}
						<p className="text-xl font-bold text-gray-700 px-2">{data.price.S}</p>
					</div>
					{data.priceOff.S && (
						<div className="flex items-center">
							<p className="text-sm font-light text-gray-700 px-2">過去価格:</p>
							<p className="text-sm font-light text-gray-700 px-2 line-through">
								{calculateOriginalPrice(data.price.S, data.priceOff.S)}
							</p>
						</div>
					)}
				</div>
			</Link>
		</div>
	)
}

const CategoryItems = ({ categoryFromDynamo }) => {
	console.log('Categoryitems: ', categoryFromDynamo)

	// const extractSimpleValuesFromDynamoDBItem = (dynamoDbItem) => {
	// 	let plainObject = {}
	// 	for (const [key, valueObj] of Object.entries(dynamoDbItem)) {
	// 		// MEMO DynamoDBの値オブジェクトのうち、'S', 'N', 'B', 'BOOL'などのキーに対応する値だけを取り出す
	// 		const valueKey = Object.keys(valueObj).find((k) => ['S', 'N', 'B', 'BOOL'].includes(k))
	// 		plainObject[key] = valueObj[valueKey]
	// 	}
	// 	return plainObject
	// }

	// const extractSimpleValuesFromDynamoDBItems = (dynamoDbItems) => {
	// 	console.log('extractSimpleValuesFromDynamoDBItems', dynamoDbItems)
	// 	// Object.valuesを使ってオブジェクトの各配列にアクセス
	// 	return Object.values(dynamoDbItems)
	// 		.flat()
	// 		.map((item) => extractSimpleValuesFromDynamoDBItem(item))
	// }

	// // dealItemsFromDynamoの値を使って処理を実行
	// let plainArray = extractSimpleValuesFromDynamoDBItems(categoryItemsFromDynamo)

	// return (
	// 	<>
	// 		{categoryFromDynamo.map((data) => (
	// 			<div key={data.asin.S} className="deal-item">
	// 				<div className="relative">
	// 					{/* <h3 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 mt-10">{h1Value}</h3> */}
	// 					<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1fcff1] to-[#234cb6] mb-2"></div>
	// 				</div>
	// 				<div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white mt-6">
	// 					{data.map((item) => (
	// 						<div key={item.asin.S}>
	// 							<CategoryItem data={item} />
	// 						</div>
	// 					))}
	// 				</div>
	// 			</div>
	// 		))}
	// 	</>
	// )

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white mt-6">
				{categoryFromDynamo.map((item) => (
					<div key={item.asin.S} className="deal-item">
						{/* ここに各商品情報を表示するコード */}
						<CategoryItem data={item} />
					</div>
				))}
			</div>
		</>
	)
}

export default CategoryItems
