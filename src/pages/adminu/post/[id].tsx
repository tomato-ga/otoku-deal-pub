import React, { useEffect, useState } from 'react'
import Editor from '../newpost'
import { useRouter } from 'next/router'

interface PostData {
	id: string
	title: string
	content: string
	tags: string[]
}

interface EditorProps {
	initialTitle: string
	initialContent: string
	initialTags: string
	postId?: string | null
	onSave: (data: { title: string; content: string; tags: string; postId?: string | null }) => void
}

// TODO fetchして表示できてない
const PostEditor: React.FC = () => {
	const router = useRouter()
	const { postId } = router.query

	const [post, setPost] = useState<PostData | null>(null)

	useEffect(() => {
		const fetchPost = async () => {
			// postIdがstring型で非空であることを確認
			if (typeof postId === 'string' && postId.trim() !== '') {
				try {
					// 正しいAPIエンドポイントを使用
					const response = await fetch(`/api/admin_postideditor?id=${postId}`)
					if (!response.ok) throw new Error('データの取得に失敗しました。')
					const postData = await response.json() // データ構造に注意してアクセス
					setPost({
						id: postId,
						title: postData.data.title,
						content: postData.data.content,
						tags: postData.data.tags
					})
				} catch (error) {
					console.error('エラー:', error)
				}
			}
		}

		fetchPost()
	}, [postId])

	const handleSave = async ({
		title,
		content,
		tags,
		postId
	}: {
		title: string
		content: string
		tags: string
		postId?: string | null
	}) => {
		const endpoint = postId ? `/api/posts/update/${postId}` : '/api/posts/new'
		const method = postId ? 'PUT' : 'POST'

		try {
			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, content, tags })
			})

			if (response.ok) {
				console.log('投稿が保存されました')
			} else {
				console.error('投稿の保存に失敗しました')
			}
		} catch (error) {
			console.error('エラー:', error)
		}
	}

	return (
		<div>
			{post ? (
				<Editor
					initialTitle={post.title}
					initialContent={post.content}
					initialTags={post.tags.join(', ')}
					postId={post.id}
					onSave={handleSave}
				/>
			) : (
				'Loading...'
			)}
		</div>
	)
}

export default PostEditor
