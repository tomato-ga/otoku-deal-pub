import Image from 'next/image'
import Link from 'next/link'
import Pagination from './Pagination'
import TopHeader from './TopHeader'
import SideCategoryLinks from './SideCategoryLinks'
import Footer from './Footer'
import Sidebar from './Sidebar'

const PaginationContent = ({ result, hasNextPage, showPagination }) => {
	const calculateOriginalPrice = (price, priceOff) => {
		const parsedPrice = parseInt(price.replace('￥', '').replace(',', ''), 10)
		const discountRate = parseFloat(priceOff.replace('-', '').replace('%', '')) / 100
		return `￥${Math.round(parsedPrice / (1 - discountRate)).toLocaleString()}`
	}

	const truncateString = (str, num) => {
		if (str.length <= num) {
			return str
		}
		return str.slice(0, num) + '...'
	}

	const extractAsin = (value) => {
		return value.replace('ASIN#', '')
	}

	return (
		<>
			<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
				{/* Main content */}
				<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 bg-white">
						{result.map((data) => (
							<Link href={`/items/${data.date.S}/${extractAsin(data.asin.S)}`} key={data.asin.S} prefetch={false}>
								<div className="border p-2 bg-white flex flex-col h-full cursor-pointer">
									<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
										<img
											src={data.imageUrl.S}
											alt={data.productName.S}
											className="w-full max-h-[270px] object-contain"
										/>
									</div>
									<h2 className="text-md font-semibold mb-1 text-gray-800 px-2 overflow-hidden">
										{truncateString(data.productName.S, 50)}
									</h2>
									<div className="mt-auto">
										<div className="flex items-center">
											{data.priceOff.S && <p className="text-xl font-bold text-red-600 px-2">{data.priceOff.S}</p>}
											<p className="text-xl font-bold text-gray-700 px-2">{data.price.S}</p>
										</div>
										{data.priceOff && (
											<div className="flex items-center">
												<p className="text-sm font-light text-gray-700 px-2">過去価格:</p>
												<p className="text-sm font-light text-gray-700 px-2 line-through">
													{calculateOriginalPrice(data.price.S, data.priceOff.S)}
												</p>
											</div>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
					{showPagination && <Pagination hasNextPage={!!hasNextPage} />}
				</div>

				{/* Sidebar */}
				<Sidebar />
			</div>
		</>
	)
}

export default PaginationContent
