// MEMO postsの個別ページ

import { useEffect, useState } from 'react'
import Link from 'next/link'

import TopHeader from '@/components/TopHeader'
import Itemspagenavbar from '@/components/ItemsPage3navbar'
import PostsGrid from '@/components/PostGrid'

export interface Post {
	id: string
	title: string
	created_at: string
	updated_at: string
	thumb_url: string
	tags: string
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
	}, [])

	console.log(postLists)

	return (
		<>
			<TopHeader />
			<Itemspagenavbar />

			<PostsGrid postLists={postLists} displayMode='default' />
		</>
	)
}

export default PostsList
