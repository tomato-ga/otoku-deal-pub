// TODO SQLからデータを撮りだしてMarkdownコンポーネントにstringを渡す
// MEMO postsの個別ページ

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import TopHeader from '@/components/TopHeader'
import Itemspagenavbar from '@/components/ItemsPage3navbar'


interface Post {
	id: string
	title: string
	created_at: string
}

const PostsList = () => {
	const [postLists, setPostLists] = useState<Post[]>([])

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/admin_listposts', {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})
				if (response.ok) {
					const sqldata = await response.json()
					setPostLists(sqldata.data)
				} else {
					console.error('Failed to fetch data:', response.status)
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		fetchData()
	})

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	// TODO CSS調整
	return (
		<>
			<TopHeader />
			<Itemspagenavbar />


			<div className="postlists">
				{postLists.map((post) => (
					<div className="flex items-center justify-center" key={post.id}>
						<ul>
							<li className="m-3 text-4xl text-slate-700">
								<Link href={`/post/${post.id}`}>
									<div className="relative">
										<h2 className="text-4xl font-bold pt-3 pr-3 pb-3 pl-1 mt-10 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text">
											{post.title}
										</h2>
									</div>
									<div className="text-sm">{formatDate(post.created_at)}</div>
								</Link>
							</li>
						</ul>
					</div>
				))}
			</div>
		</>
	)
}

export default PostsList
