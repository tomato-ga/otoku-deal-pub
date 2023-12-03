import { useRouter } from 'next/router'

const Pagination = ({ lastEvaluatedKey, hasNextPage }) => {
	const router = useRouter()
	const currentPage = parseInt(router.query.number) || 1

	const handlePrevPage = () => {
		const prevPageNumber = currentPage - 1
		const prevPaginationNumber = currentPage - 2
		const lastEvaluatedKeyString = localStorage.getItem(`lastEvaluatedKey_page_${prevPaginationNumber}`)
		const lastEvaluatedKey = lastEvaluatedKeyString ? JSON.parse(lastEvaluatedKeyString) : null

		if (lastEvaluatedKey) {
			router.push(`/page/${prevPageNumber}?lastkey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`)
		} else {
			router.push(`/page/${prevPageNumber}`)
		}
	}

	// 例: Paginationコンポーネント
	const handleNextPage = async () => {
		const nextPageNumber = currentPage + 1
		const response = await fetch(`/api/indexitems?lastKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`)
		const data = await response.json()

		if (data.lastEvaluatedKey) {
			router.push(`/page/${nextPageNumber}?lastKey=${encodeURIComponent(JSON.stringify(data.lastEvaluatedKey))}`)
		} else {
			router.push(`/page/${nextPageNumber}`)
		}
	}

	return (
		<div>
			<ul className="inline-flex -space-x-px text-base h-10 pt-10">
				{currentPage > 1 && (
					<button
						onClick={handlePrevPage}
						className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-0 mr-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
					bg-gradient-to-r from-[#FFED46] to-[#FF7EC7] "
					>
						前のページ
					</button>
				)}
				{hasNextPage && (
					<button
						onClick={handleNextPage}
						className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
						bg-gradient-to-r from-[#B7DCFF] to-[#FFA4F6]"
					>
						次のページ
					</button>
				)}
			</ul>
		</div>
	)
}

export default Pagination
