import { useState } from 'react'
import useAuthStore from '@/jotai/authStore'

const Editor = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState('')
	const author = 'dondonbe'

	const handleTitleChange = (e) => setTitle(e.target.value)
	const handleContentChange = (e) => setContent(e.target.value)
	const handleTagsChange = (e) => setTags(e.target.value)

	const handleSave = async () => {
		const articleData = { title, content, tags, author }
		const response = await fetch('/api/savearticle', {
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

	return (
		<div className="flex items-center justify-center flex-col">
			<h1 className="text-2xl mt-4 border-b-2">タイトル</h1>
			<textarea
				value={title}
				onChange={handleTitleChange}
				rows="3"
				cols="100"
				placeholder="タイトル入力"
				className="border-2 m-5"
			></textarea>

			<h2 className="text-2xl mt-4 border-b-2">コンテンツ本文</h2>
			<textarea
				value={content}
				onChange={handleContentChange}
				rows="10" // 行数を増やす
				cols="100"
				placeholder="コンテンツをここに入力"
				className="border-2 m-5"
			></textarea>

			<h2 className="text-2xl mt-4 border-b-2">タグ</h2>
			<input
				type="text"
				value={tags}
				onChange={handleTagsChange}
				placeholder="タグをカンマ区切りで入力"
				className="border-2 m-5 w-3/4" // 幅を増やす
			/>
			<button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded mt-4">
				保存
			</button>
		</div>
	)
}

export default Editor
