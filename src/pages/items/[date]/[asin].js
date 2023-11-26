// /Volumes/SSD_1TB/AmazonChrome/amazon-pages-router/src/pages/items/[asin].js
import Link from 'next/link'
import TopHeader from '@/components/TopHeader'
import Footer from '@/components/Footer'
import BreadCrumb from '@/components/Breadcrumb'

import StarDisplayComponent from '@/components/StarRating'
import { useEffect, useState } from 'react'
import CustomizedAccordions from '@/components/accordion'

import { dynamoQueryAsin } from '@/funcs/AsinDynamodb'
import { dynamoQueryIndex } from '@/funcs/DpIndexDynamodb'
import { dynamoQueryCategory } from '@/funcs/CategoryDynamodb'

import { NextSeo, ArticleJsonLd } from 'next-seo'
import Sidebar from '@/components/Sidebar'
import Itemspagenavbar from '@/components/ItemsPage3navbar'

export default function ItemsPage({
	ProductasinFetchFromDynamo,
	ReviewasinFetchFromDynamo,
	relatedIndexFromDynamo,
	categoryFromDynamo,
	asin
}) {
	const [localData, setLocalData] = useState([])

	useEffect(() => {
		let savedPagelists = {
			pages: []
		}

		// 既存の閲覧履歴ローカルを取得
		const existingData = JSON.parse(localStorage.getItem('pageData'))
		if (existingData && existingData.pages) {
			savedPagelists.pages = existingData.pages
			setLocalData(existingData.pages)
		}

		// 新しいデータが既に存在する場合、配列から削除
		const existingIndex = savedPagelists.pages.findIndex((page) => page.asin.S === ProductasinFetchFromDynamo.asin.S)
		if (existingIndex !== -1) {
			savedPagelists.pages.splice(existingIndex, 1)
		}

		// 配列の先頭にデータを追加
		savedPagelists.pages.unshift(ProductasinFetchFromDynamo)

		// データをローカルストレージに保存
		localStorage.setItem('pageData', JSON.stringify(savedPagelists))
	}, [ProductasinFetchFromDynamo.asin.S])

	// MEMO 最新のデータをローカルに保存する 最新情報とカテゴリー情報
	useEffect(() => {
		localStorage.setItem('LatestItems', JSON.stringify(relatedIndexFromDynamo))
	}, [relatedIndexFromDynamo])

	let descriptionText
	if (ProductasinFetchFromDynamo.descripText) {
		descriptionText = ProductasinFetchFromDynamo.descripText.S
	}

	/*
    レビューのテキストの必要の無い場所を処理
    ex: 4.3 5つ星のうち4.3
    "4.3    5つ星のうち4.3"
    */
	let reviewStar
	if (ReviewasinFetchFromDynamo.reviewStar) {
		let reviewStarParts = ReviewasinFetchFromDynamo.reviewStar.S.split('5つ星')
		reviewStar = reviewStarParts[0].trim()
	}

	let reviewCount
	if (ReviewasinFetchFromDynamo.reviewCount) {
		reviewCount = ReviewasinFetchFromDynamo.reviewCount.S
	}

	let reviewText
	if (ReviewasinFetchFromDynamo.reviewText) {
		reviewText = ReviewasinFetchFromDynamo.reviewText.S //.replace(/\n/g, '<br>')
	} else if (!reviewText) {
		reviewText = 'レビューがありません'
	}

	// もしテキストがあったら追加
	let outputText
	if (ProductasinFetchFromDynamo.outputText) {
		outputText = (
			<>
				<h3 className="text-2xl font-bold pb-3">3つのおすすめ理由</h3>
				<div>{ProductasinFetchFromDynamo.outputText.S}</div>
			</>
		)
	} else {
		outputText = null
	}

	let outputTitle
	if (ProductasinFetchFromDynamo.outputTitle) {
		outputTitle = ProductasinFetchFromDynamo.outputTitle.S
	} else {
		outputTitle = ProductasinFetchFromDynamo.productName.S
	}

	function calculateOriginalPrice(price, discountPercentage) {
		// "%"と"-"を取り除いて、割引率を数値に変換
		const percentage = parseFloat(discountPercentage.replace('%', '').replace('-', ''))
		// 割引率が存在しない、または無効な場合はNaNを返す
		if (isNaN(percentage)) return NaN
		const discount = percentage / 100

		return price / (1 - discount)
	}

	const priceNumber = parseFloat(ProductasinFetchFromDynamo.price.S.replace('￥', '').replace(',', ''))
	const originalPrice = calculateOriginalPrice(priceNumber, ProductasinFetchFromDynamo.priceOff.S)

	const extractAsin = (value) => {
		if (!value) {
			return ''
		}

		return value.replace('ASIN#', '')
	}

	return (
		<>
			<NextSeo
				title={ProductasinFetchFromDynamo.productName.S}
				description={`${ProductasinFetchFromDynamo.productName.S}のセール情報を紹介しています`}
				canonical={``} // TODO: ドメインURL入れる
			/>

			<ArticleJsonLd
				url={``}
				title={ProductasinFetchFromDynamo.productName.S}
				images={ProductasinFetchFromDynamo.imageUrl.S}
				datePublished={ProductasinFetchFromDynamo.date.S}
				authorName="激安特価セール速報運営者"
				publisherName="激安特価セール速報"
				description={`${ProductasinFetchFromDynamo.productName.S}のセール情報を紹介しています`}
			/>

			<div className="flex flex-col min-h-screen">
				<TopHeader />
				<div className="flex-grow">
					{/* PC表示の場合は3段目のトップヘッダーを表示する */}
					<Itemspagenavbar />

					<BreadCrumb
						categoryName={ProductasinFetchFromDynamo.categoryName.S}
						productName={ProductasinFetchFromDynamo.productName.S}
					/>

					{/* スマホ表示では子要素を縦に並べる */}
					<div className="bg-white p-4 max-w-full mx-auto flex flex-col sm:flex-row">
						{/* 画像表示: スマホ表示ではフル幅 */}
						<div className="w-full sm:w-1/3 pb-2">
							<div className="relative">
								<img
									src={ProductasinFetchFromDynamo.imageUrl.S}
									alt={ProductasinFetchFromDynamo.productName.S}
									width={600}
									height={600}
									style={{ objectFit: 'contain' }}
								/>
							</div>
						</div>
						{/* 商品名: スマホ表示ではフル幅 */}
						<div className="w-full sm:w-1/2 pl-3 pr-5 flex flex-col">
							<div className="">
								<h1 className="text-2xl text-black mb-4">{outputTitle}</h1>
							</div>

							{/* レビュー数表示 */}
							<div className="text-gray-500 mt-2 mb-2 items-baseline text-lg sm:w-full">
								{reviewStar} <StarDisplayComponent starCount={reviewStar} /> / {reviewCount}
							</div>

							{/* 価格表示 */}
							<div className="mt-4 mb-4 flex items-baseline flex-wrap">
								<div className="font-bold text-2xl md:text-4xl overflow-wrap:break-word">
									{ProductasinFetchFromDynamo.priceOff.S && (
										<span className="text-red-500">{ProductasinFetchFromDynamo.priceOff.S}</span>
									)}

									<span className="ml-2 text-black">{ProductasinFetchFromDynamo.price.S}</span>

									{!isNaN(originalPrice) && (
										<div className="flex items-center">
											<p className="text-sm font-light text-gray-700 px-2">過去価格:</p>
											<span className="ml-2 text-gray-500 line-through">¥{originalPrice.toFixed(0)}</span>
										</div>
									)}
								</div>
							</div>

							<Link href={ProductasinFetchFromDynamo.affUrl.S} target="_blank" prefetch={false}>
								<div className="flex justify-center items-center">
									<button className="text-xl w-full bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 mb-4">
										アマゾンへ行く
									</button>
								</div>
							</Link>
							<div className="recommendtext">
								<pre className="pb-3 overflow-auto whitespace-pre-wrap break-words">{outputText}</pre>
							</div>

							{/* レビューテキスト */}
							<div className="product">
								<CustomizedAccordions review={reviewText} productText={descriptionText} />
							</div>
						</div>
						{/* Right Sidebar: スマホ表示ではフル幅 */}
						<div className="w-full sm:w-1/5 pl-6 mt-4 sm:mt-0 sm:order-3 sm:border-l border-l-0">
							<p className="text-gray-500 mb-2 text-center">Right Sidebar</p>
						</div>
					</div>

					<div className="border-t border-gray-300 pb-3"></div>

					{/* カテゴリーの最新情報 */}
					<h2 className="text-gray-500 mt-3 mb-3 text-center text-2xl font-bold">似ている商品のセール情報</h2>
					<div className="h-0.5 bg-gradient-to-r from-[#f093fb] to-[#f5576c] ml-10 mr-10"></div>

					<div className="flex flex-col md:flex-row bg-white p-4">
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
							{categoryFromDynamo.slice(0, 8).map((data, index) => (
								<div className="text text-black" key={index}>
									<Link href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`} prefetch={false}>
										<div className="h-[270px] w-full md:h-[270px] md:w-full mb-4">
											<img
												src={data.imageUrl.S}
												alt={data.productName.S}
												className="w-full h-full"
												style={{ objectFit: 'contain' }}
											/>
										</div>
										<div className="mr-2 ml-2">
											<p>
												{data.productName.S.length > 80
													? `${data.productName.S.substring(0, 80)}...`
													: data.productName.S}
											</p>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>

					{/* 閲覧履歴 */}
					<h2 className="text-gray-500 mt-3 mb-3 text-center text-2xl font-bold">閲覧したセール情報</h2>
					<div className="h-0.5 bg-gradient-to-r from-[#43e97b] to-[#38f9d7] ml-10 mr-10"></div>

					<div className="flex flex-col md:flex-row bg-white p-4">
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
							{localData.slice(0, 8).map((data, index) => (
								<div className="text text-black" key={index}>
									<Link href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`} prefetch={false}>
										<div className="h-[270px] w-full md:h-[270px] md:w-full mb-4">
											<img
												src={data.imageUrl.S}
												alt={data.productName.S}
												className="w-full h-full"
												style={{ objectFit: 'contain' }}
											/>
										</div>
										<div className="mr-2 ml-2">
											<p>
												{data.productName.S.length > 80
													? `${data.productName.S.substring(0, 80)}...`
													: data.productName.S}
											</p>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>

					{/* インデックスの最新情報 */}
					<h2 className="text-gray-500 mt-3 mb-3 text-center text-2xl font-bold">最新セール情報</h2>
					<div className="h-0.5 bg-gradient-to-r from-[#d299c2] to-[#fef9d7] ml-10 mr-10"></div>
					<div className="flex flex-col md:flex-row bg-white p-4">
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
							{relatedIndexFromDynamo.slice(0, 8).map((data, index) => (
								<div className="text text-black" key={index}>
									<Link href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`} prefetch={false}>
										<div className="h-[270px] w-full md:h-[270px] md:w-full mb-4">
											<img
												src={data.imageUrl.S}
												alt={data.productName.S}
												className="w-full h-full"
												style={{ objectFit: 'contain' }}
											/>
										</div>
										<div className="mr-2 ml-2">
											<p>
												{data.productName.S.length > 80
													? `${data.productName.S.substring(0, 80)}...`
													: data.productName.S}
											</p>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
					{/* Sidebar */}
					<div className="block md:hidden">
						<Sidebar />
					</div>
				</div>
				<Footer />
			</div>
		</>
	)
}

export async function getServerSideProps(context) {
	const { res } = context
	res.setHeader('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=86400')

	const asin = context.params.asin

	// MEMO ASIN単体フェッチ
	const ProductasinFetchFromDynamo = await dynamoQueryAsin(asin, '商品情報')
	const ReviewasinFetchFromDynamo = await dynamoQueryAsin(asin, 'レビュー')
	const relatedIndexFromDynamo = await dynamoQueryIndex()
	const categoryFromDynamo = await dynamoQueryCategory(ProductasinFetchFromDynamo.Items[0].categoryName.S)

	// console.log('ASINページ商品情報: ', ProductasinFetchFromDynamo.Items)
	// console.log('ASINページレビュー: ', ReviewasinFetchFromDynamo.Items)

	return {
		props: {
			ProductasinFetchFromDynamo: ProductasinFetchFromDynamo.Items[0] || [],
			ReviewasinFetchFromDynamo: ReviewasinFetchFromDynamo.Items[0] || [],
			relatedIndexFromDynamo: relatedIndexFromDynamo.Items || [],
			categoryFromDynamo: categoryFromDynamo.Items ? categoryFromDynamo.Items : null,
			asin: asin
		}
	}
}
