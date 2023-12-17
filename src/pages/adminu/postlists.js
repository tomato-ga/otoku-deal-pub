import { useEffect, useState } from 'react'
import useAuthStore from '@/jotai/authStore'
import { useRouter } from 'next/router'

import AdminLayout from '@/components/AdminLayout'

const AdminPostLists = () => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const login = useAuthStore((state) => state.login)
	const router = useRouter()

	const [postLists, setPostLists] = useState([])

	useEffect(() => {
		const token = localStorage.getItem('logintoken')
		if (!token) {
			router.push('/a-login')
		} else if (!isLoggedIn) {
			login()
		}
	}, [isLoggedIn, router])

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/admin_listposts', {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})
				if (response.ok) {
					const sqldata = await response.json()
					console.log(sqldata.data)
					setPostLists(sqldata.data) // データを状態にセット
				} else {
					console.error('Failed to fetch data:', response.status)
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<AdminLayout>
			<div className="postlists">
				{postLists.map((post) => (
					<ul>
						<li key={post.id}>{post.id}</li>
					</ul>
				))}
			</div>
		</AdminLayout>
	)
}

export default AdminPostLists
