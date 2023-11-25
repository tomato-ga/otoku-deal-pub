// Pagination.js
import Link from 'next/link'
import { useRouter } from 'next/router'

const DealPagination = ({ hasNextPage }) => {
	console.log('DealPagination', hasNextPage)

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
							className="flex items-center justify-center px-4 py-2 w-32 h-10 ml-0 leading-tight text-gray-800 font-semibold bg-white dark:bg-white border border-gray-300 rounded-l-lg hover:bg-orange-100 hover:text-gray-700"
						>
							前のページ
						</button>
					</Link>
				)}
				{hasNextPage && (
					<Link href={`/group/page/${nextPage}`}>
						<button
							onClick={handleNextPage}
							className="flex items-center justify-center px-4 py-2 w-32 h-10 ml-0 leading-tight text-gray-800 font-semibold bg-white dark:bg-white border border-gray-300 rounded-l-lg hover:bg-orange-100 hover:text-gray-700"
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
