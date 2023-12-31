import { useEffect, useState } from 'react'
import useAuthStore from '@/jotai/authStore'
import { useRouter } from 'next/router'

import AdminLayout from '@/components/AdminLayout'

const Editor = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState('')
	const author = 'dondonbe'

	const [toast, setToast] = useState({ show: false, message: '' })
	const showToast = (message) => {
		setToast({ show: true, message })
	}

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const login = useAuthStore((state) => state.login) // loginアクションを取得
	const router = useRouter()

	const handleTitleChange = (e) => setTitle(e.target.value)
	const handleContentChange = (e) => setContent(e.target.value)
	const handleTagsChange = (e) => setTags(e.target.value)

	const handleSave = async () => {
		const articleData = { title, content, tags, author }
		const response = await fetch('/api/admin_newarticle', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(articleData)
		})

		if (response.ok) {
			console.log('記事がデータベースに保存されました')
			showToast('記事がデータベースに保存されました')
		} else {
			console.error('Failed to save article')
			// ここに失敗時の処理を記述（任意）
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('logintoken')
		if (!token) {
			router.push('/a-login')
		} else if (!isLoggedIn) {
			login() // Zustandストアのログイン状態を更新
		}
	}, [isLoggedIn, router])

	return (
		<AdminLayout>
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-xl mt-4 border-b-2">タイトル</h1>
				<textarea
					value={title}
					onChange={handleTitleChange}
					rows="3"
					placeholder="タイトル入力"
					className="w-full max-w-lg border-2 m-2"
				></textarea>

				<h2 className="text-xl mt-4 border-b-2">コンテンツ本文</h2>
				<textarea
					value={content}
					onChange={handleContentChange}
					rows="10"
					placeholder="コンテンツをここに入力"
					className="w-full max-w-lg border-2 m-2"
				></textarea>

				<h2 className="text-xl mt-4 border-b-2">タグ</h2>
				<input
					type="text"
					value={tags}
					onChange={handleTagsChange}
					placeholder="タグをカンマ区切りで入力"
					className="w-3/4 max-w-lg border-2 m-2"
				/>
				<button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded mt-4">
					保存
				</button>
				{toast.show && <span className="ml-4 text-green-600">{toast.message}</span>}

				{toast.show && (
					<div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 border border-blue-300 shadow-lg rounded-md bg-blue-100 text-blue-800">
						{toast.message}
					</div>
				)}
			</div>
		</AdminLayout>
	)
}

export default Editor
