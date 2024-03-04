import { useEffect, useState, ChangeEvent } from 'react' // ChangeEvent をインポート
import useAuthStore from '@/jotai/authStore'
import { useRouter } from 'next/router'

import AdminLayout from '@/components/AdminLayout'
import FileUploadArea from '@/components/drag'

interface UploadResponse {
	urls: string[]
}

const Editor = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState('')
	const author = 'dondonbe'

	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [toast, setToast] = useState({ show: false, message: '' })
	const showToast = (message: string) => {
		// message の型を string に
		setToast({ show: true, message })
	}

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const login = useAuthStore((state) => state.login) // login アクションを取得
	const router = useRouter()

	const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value) // e の型を指定
	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value) // e の型を指定
	const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value) // e の型を指定、HTMLInputElement に変更

	const onFileSelected = (files: File[]) => {
		setSelectedFiles(files)
	}

	const handleSave = async () => {
		if (selectedFiles.length > 0) {
			const formData = new FormData()
			selectedFiles.forEach((file) => {
				formData.append('files', file)
			})

			try {
				const response = await fetch('/api/admin_s3upload', {
					method: 'POST',
					body: formData
				})

				if (response.ok) {
					const data: UploadResponse = await response.json() // アップロードされた画像のURLの配列を想定
					// 本文に画像のURLを挿入
					let imgTags = data.urls.map((url) => `<img src="${url}" alt="uploaded image">`).join('\n')
					setContent((prevContent) => prevContent + '\n' + imgTags)
					showToast('画像がアップロードされ、記事が保存されました')
				} else {
					console.error('アップロードに失敗しました。')
				}
			} catch (error) {
				console.error('アップロード中にエラーが発生しました:', error)
			}
		}

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

	// 画像アップロードの関数
	const uploadImages = async (files: File[]) => {
		const formData = new FormData()
		files.forEach((file) => formData.append('files', file))

		try {
			const response = await fetch('/api/admin_s3upload', {
				method: 'POST',
				body: formData
			})

			if (!response.ok) throw new Error('アップロード失敗')

			const data: UploadResponse = await response.json()
			let imgTags = data.urls.map((url) => `<img src="${url}" alt="uploaded image">`).join('\n')
			setContent((prev) => `${prev}\n${imgTags}`)
			showToast('画像アップロード成功')
		} catch (error) {
			console.error('アップロードエラー', error)
			showToast('画像アップロードエラー')
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('logintoken')
		if (!token) {
			router.push('/a-login')
		} else if (!isLoggedIn) {
			login() // Zustand ストアのログイン状態を更新
		}
	}, [isLoggedIn, login, router])

	return (
		<AdminLayout>
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-xl mt-4 border-b-2">タイトル</h1>
				<textarea
					value={title}
					onChange={handleTitleChange}
					rows={3}
					style={{ width: '90%' }}
					placeholder="タイトル入力"
					className="border-2 m-2"
				></textarea>

				<h2 className="text-xl mt-4 border-b-2">コンテンツ本文</h2>
				<textarea
					value={content}
					onChange={handleContentChange}
					rows={50}
					style={{ width: '90%' }}
					placeholder="コンテンツをここに入力"
					className="border-2 m-2"
				></textarea>

				<h2 className="text-xl mt-4 border-b-2">タグ</h2>
				<input
					type="text"
					value={tags}
					onChange={handleTagsChange}
					// rows={3}
					style={{ width: '90%' }}
					placeholder="タグをカンマ区切りで入力"
					className="border-2 m-2 h-20"
				/>

				<FileUploadArea onFileSelected={setSelectedFiles} onUpload={uploadImages} />

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
