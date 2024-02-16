import Link from 'next/link'
import React from 'react'

const DealItem = ({ data }) => {
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
		<div key={data.asin} className="border p-2 bg-white flex flex-col h-full">
			<Link href={`/items/${data.date}/${extractAsin(data.asin)}`}>
				<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
					<img src={data.imageUrl} alt={data.productName} className="w-full max-h-[270px] object-contain" />
				</div>

				<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
					{truncateString(data.productName, 50)}
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

const DealItems = ({ dealItemsFromDynamo }) => {
	const extractSimpleValuesFromDynamoDBItem = (dynamoDbItem) => {
		let plainObject = {}
		for (const [key, valueObj] of Object.entries(dynamoDbItem)) {
			// MEMO DynamoDBの値オブジェクトのうち、'S', 'N', 'B', 'BOOL'などのキーに対応する値だけを取り出す
			const valueKey = Object.keys(valueObj).find((k) => ['S', 'N', 'B', 'BOOL'].includes(k))
			plainObject[key] = valueObj[valueKey]
		}
		return plainObject
	}

	const extractSimpleValuesFromDynamoDBItems = (dynamoDbItems) => {
		// Object.valuesを使ってオブジェクトの各配列にアクセス
		return Object.values(dynamoDbItems)
			.flat()
			.map((item) => extractSimpleValuesFromDynamoDBItem(item))
	}

	// dealItemsFromDynamoの値を使って処理を実行
	let plainArray = extractSimpleValuesFromDynamoDBItems(dealItemsFromDynamo)

	// h1によってグループ化されたオブジェクトを作成する
	const groupedByH1 = plainArray.reduce((group, item) => {
		// h1値が同じアイテムを同じグループにする
		const dealName = item.dealName || 'その他'
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
						<h3 className="text-4xl font-bold pt-3 pr-3 pb-3 pl-1 mt-10 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text">
							{h1Value}
						</h3>
						<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1fcff1] to-[#234cb6] mb-2"></div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white mt-6">
						{items.map((item) => (
							<div key={item.asin}>
								<DealItem data={item} />
							</div>
						))}
					</div>
				</div>
			))}
		</>
	)
}

export default DealItems
