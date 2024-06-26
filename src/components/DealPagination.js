// Pagination.js
import Link from 'next/link'
import { useRouter } from 'next/router'

const DealPagination = ({ hasNextPage }) => {


	const router = useRouter()
	const currentPage = parseInt(router.query.number) || 1
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1
	const prevPaginationNumber = currentPage - 2

	const handlePrevPage = () => {
		const prevPageNumber = currentPage - 1
		const lastEvaluatedKey = localStorage.getItem(`lastEvaluatedKey_group_page_${prevPaginationNumber}`)
		router.push(`/group/page/${prevPageNumber}?lastkey=${encodeURIComponent(lastEvaluatedKey || '')}`)
	}

	const handleNextPage = () => {
		const nextPageNumber = currentPage + 1
		const lastEvaluatedKey = localStorage.getItem(`lastEvaluatedKey_group_page_${currentPage}`)
		router.push(`/group/page/${nextPageNumber}?lastkey=${encodeURIComponent(lastEvaluatedKey || '')}`)
	}

	return (
		<div>
			<ul className="inline-flex -space-x-px text-base h-10 pt-10">
				{currentPage > 1 && (
					<Link href={`/group/page/${prevPage}`}>
						<button
							onClick={handlePrevPage}
							className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-0 mr-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
							bg-gradient-to-r from-[#FFED46] to-[#FF7EC7]"
						>
							前のページ
						</button>
					</Link>
				)}
				{hasNextPage && (
					<Link href={`/group/page/${nextPage}`}>
						<button
							onClick={handleNextPage}
							className="flex items-center justify-center px-4 py-2 w-40 h-14 ml-2 leading-tight text-gray-800 font-semibold rounded-lg hover:text-gray-100
							bg-gradient-to-r from-[#B7DCFF] to-[#FFA4F6]"
						>
							次のページ
						</button>
					</Link>
				)}
			</ul>
		</div>
	)
}

export default DealPagination
