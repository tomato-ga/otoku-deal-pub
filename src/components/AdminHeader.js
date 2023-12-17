// components/Header.js

import { useRouter } from 'next/router'
import useAuthStore from '@/jotai/authStore'
import React from 'react'

const AdminHeader = () => {
	const router = useRouter()
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const logout = useAuthStore((state) => state.logout)

	const handleLogout = () => {
		logout() // Zustandストアのログアウトアクションを呼び出し
		localStorage.removeItem('logintoken') // localStorageからトークンを削除
		router.push('/a-login') // ログインページにリダイレクト
	}

	return (
		<header className="bg-gray-800 text-white p-4 flex justify-between items-center">
			<h1 className="text-xl">編集画面</h1>
			{isLoggedIn && (
				<button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
					ログアウト
				</button>
			)}
		</header>
	)
}

export default AdminHeader
