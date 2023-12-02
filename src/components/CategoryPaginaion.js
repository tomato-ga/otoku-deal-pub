// /Volumes/SSD_1TB/otoku-deal/src/components/CategoryPaginaion.js
import Link from 'next/link'
import { useRouter } from 'next/router'

const CategoryPagination = ({ categoryName, hasNextPage }) => {
	const router = useRouter()
	const currentPage = parseInt(router.query.number) || 1
	const nextPage = currentPage + 1
	const prevPage = currentPage - 1
	const prevPaginationNumber = currentPage - 2

	const handlePrevPage = () => {
		const prevPageNumber = currentPage - 1
		const lastEvaluatedKey = localStorage.getItem(
			`lastEvaluatedKey_category_page_${categoryName}_${prevPaginationNumber}`
		)
		router.push(
			`/category/${categoryName}/page/${prevPageNumber}?lastkey=${encodeURIComponent(lastEvaluatedKey || '')}`
		)
	}

	const handleNextPage = () => {
		const nextPageNumber = currentPage + 1
		const lastEvaluatedKey = localStorage.getItem(`lastEvaluatedKey_category_page_${categoryName}_${currentPage}`)
		router.push(
			`/category/${categoryName}/page/${nextPageNumber}?lastkey=${encodeURIComponent(lastEvaluatedKey || '')}`
		)
	}

	return (
		<div>
			<ul className="inline-flex -space-x-px text-base h-10 pt-10">
				{currentPage > 1 && (
					<Link href={`/category/${categoryName}/page/${prevPage}`}>
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
					<Link href={`/category/${categoryName}/page/${nextPage}`}>
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

export default CategoryPagination
