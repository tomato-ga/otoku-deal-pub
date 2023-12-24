import { useEffect, useState } from 'react'
import useAuthStore from '@/jotai/authStore'
import { useRouter } from 'next/router'

import AdminLayout from '@/components/AdminLayout'
import RichTextEditor from '@/components/Admslate'

const initialValue = [
	{
		type: 'paragraph',
		children: [{ text: 'コンテンツをここに入力' }]
	}
]

const PostEditor = () => {
	const router = useRouter()
	const [post, setPost] = useState(null)
	const { id } = router.query
	console.log('id', id)

	const [title, setTitle] = useState('')
	const [content, setContent] = useState([...initialValue])
	const [tags, setTags] = useState('')
	const author = 'dondonbe'
	const [saveSuccess, setSaveSuccess] = useState(false)
	const [isContentLoaded, setIsContentLoaded] = useState(false) // コンテンツのロード状態を追跡

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const login = useAuthStore((state) => state.login) // loginアクションを取得

	const handleTitleChange = (e) => setTitle(e.target.value)
	// const handleContentChange = (e) => setContent(e.target.value)
	const handleContentChange = (newValue) => {
		if (Array.isArray(newValue) && newValue.length > 0) {
			// check if newValue is an array and not empty
			setContent(newValue)
		}
	}
	const handleTagsChange = (e) => setTags(e.target.value)

	const handleSave = async () => {
		const articleData = { id, title, content: JSON.stringify(content), tags, author }
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
		setSaveSuccess(true)
	}

	useEffect(() => {
		const token = localStorage.getItem('logintoken')
		if (!token) {
			router.push('/a-login')
		} else if (!isLoggedIn) {
			login() // Zustandストアのログイン状態を更新
		}
	}, [isLoggedIn, router])

	useEffect(() => {
		// idがない場合は何もしない
		if (!id) {
			setIsContentLoaded(true) // コンテンツが未ロードでもエディタを表示
			return
		}

		const fetchPost = async () => {
			const response = await fetch(`/api/admin_postideditor?id=${id}`)
			if (response.ok) {
				const postData = await response.json()
				setTitle(postData.data.title)

				// Parse the fetched content safely
				try {
					const fetchedContent = JSON.parse(postData.data.content)
					if (Array.isArray(fetchedContent) && fetchedContent.length > 0) {
						// Check if parsed content is an array and not empty
						setContent(fetchedContent)
					} else {
						console.error('Fetched content is not in expected format:', fetchedContent)
					}
				} catch (error) {
					console.error('Error parsing content:', error)
				}

				setTags(postData.data.tags)
			}
		}

		fetchPost()
	}, [id])

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
				<RichTextEditor value={content} onChange={handleContentChange} />

				{/* <textarea
					value={content}
					onChange={handleContentChange}
					rows="10"
					placeholder="コンテンツをここに入力"
					className="w-full max-w-lg border-2 m-2"
				></textarea> */}

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
				{saveSuccess && <div className="mt-2 bg-green-500 text-white p-2 rounded">保存しました</div>}
			</div>
		</AdminLayout>
	)
}

export default PostEditor
