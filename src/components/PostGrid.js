import Link from 'next/link'

const formatDate = (dateString) => {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	return `${year}/${month}/${day} ${hours}:${minutes}`
}

const PostsGrid = ({ postLists, displayMode }) => {
	const gridClass =
		displayMode === 'sidebar' ? 'grid-cols-1' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8'

	return (
		<div className={`grid ${gridClass} gap-8 p-8`}>
			{postLists.map((post) => (
				<div key={post.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition ">
					<Link href={`/post/${post.id}`}>
						<div className="relative">
							<img src={post.thumb_url} alt={post.title} className="w-full object-cover" />
							<div className="absolute inset-0 "></div>
						</div>
						<div className="p-4">
							<span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{post.tags}</span>
							<h2 className="text-xl font-bold text-white mt-2">{post.title}</h2>
							<p className="text-gray-400 text-sm mt-2 mb-4">{formatDate(post.updated_at)}</p>
							<span className="inline-block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-bold hover:underline">
								続きを読む
							</span>
						</div>
					</Link>
				</div>
			))}
		</div>
	)
}

export default PostsGrid
