import { useEffect, useState } from 'react'
import useAuthStore from '@/jotai/authStore'
import { useRouter } from 'next/router'

import AdminLayout from '@/components/AdminLayout'

const Editor = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState('')
	const author = 'dondonbe'

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const login = useAuthStore((state) => state.login) // loginアクションを取得
	const router = useRouter()

	const handleTitleChange = (e) => setTitle(e.target.value)
	const handleContentChange = (e) => setContent(e.target.value)
	const handleTagsChange = (e) => setTags(e.target.value)

	const handleSave = async () => {
		const articleData = { title, content, tags, author }
		const response = await fetch('/api/admin_savearticle', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(articleData)
		})

		if (response.ok) {
			console.log('Article saved successfully')
			// ここに成功時の処理を記述（任意）
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
			</div>
		</AdminLayout>
	)
}

export default Editor