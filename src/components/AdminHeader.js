// components/Header.js

import { useRouter } from 'next/router'
import useAuthStore from '@/jotai/authStore'
import React from 'react'
import Link from 'next/link'

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
			<div className="flex-grow">
				<h1 className="text-lg md:text-xl inline mr-4">編集画面</h1>
				<Link href="/adminu/postlists">
					<span className="mr-4 cursor-pointer">ポスト一覧</span>
				</Link>
				<Link href="/adminu/newpost">
					<span className="cursor-pointer">新規投稿</span>
				</Link>
			</div>
			{isLoggedIn && (
				<button
					onClick={handleLogout}
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded text-sm md:text-base"
				>
					ログアウト
				</button>
			)}
		</header>
	)
}

export default AdminHeader
