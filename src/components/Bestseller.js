import Link from 'next/link'

const BestSellerItem = ({ data }) => {
	const truncateString = (str, num) => {
		if (str.length <= num) {
			return str
		}
		return str.slice(0, num) + '...'
	}

	return (
		<div key={data.asin.S} className="border p-2 bg-white flex flex-col h-full">
			{/* Image */}
			<div className="flex-grow flex justify-center items-center mb-4 h-[270px] w-full">
				<img src={data.imageUrl.S} alt={data.productName.S} className="w-full h-full object-contain" />
			</div>
			{/* Product Name */}
			<div className="h-20 overflow-hidden">
				<h2 className="text-md font-semibold mb-1 text-gray-800 px-2">{truncateString(data.productName.S, 50)}</h2>
			</div>
			{/* Other product details would go here */}
		</div>
	)
}

const BestSellerItems = ({ bestSellerFromDynamo }) => {
	const bestSellerTitle = bestSellerFromDynamo[0].rankingName.S

	return (
		<>
			<div className="relative">
				<h3 className="text-2xl font-bold pt-3 pr-3 pb-3 pl-1 mt-16">{bestSellerTitle}</h3>
				<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#19fb9b] via-[#199890] to-[#005f59] mb-2"></div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white mt-6">
				{bestSellerFromDynamo.map((data) => (
					<div key={data.asin.S}>
						<Link href={data.productPageUrl.S} target="_blank">
							<BestSellerItem data={data} />
						</Link>
					</div>
				))}
			</div>
		</>
	)
}

export default BestSellerItems
