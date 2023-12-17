// pages/adminu/index.js

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAuthStore from '@/jotai/authStore'

const AdminuPage = () => {
	const router = useRouter()
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

	useEffect(() => {
		if (!isLoggedIn) {
			router.push('/a-login')
		}
	}, [isLoggedIn, router])

	return <div>{/* 管理者ページのコンテンツ */}</div>
}

export default AdminuPage
