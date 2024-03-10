import React, { useEffect, useState, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'
import Editor from '../newpost'
import useAuthStore from '@/jotai/authStore'

interface PostData {
	data: {
		title: string
		content: string
		tags: string[]
	}
}

const PostEditor: React.FC = () => {
	const router = useRouter()
	const { id } = router.query

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const login = useAuthStore((state) => state.login)

	const [post, setPost] = useState<PostData | null>(null)

	useEffect(() => {
		if (!isLoggedIn) {
			router.push('/a-login')
		} else {
			login() // Zustandストアのログイン状態を更新
		}
	}, [isLoggedIn, login, router])

	useEffect(() => {
		const fetchPost = async () => {
			if (typeof id === 'string') {
				try {
					const response = await fetch(`/api/admin_postideditor?id=${id}`)
					if (!response.ok) throw new Error('Failed to fetch post')
					const postData: PostData = await response.json()
					setPost(postData)
				} catch (error) {
					console.error('Error fetching post:', error)
				}
			}
		}
		fetchPost()
	}, [id])

	const handleSave = async (data: { title: string; content: string; tags: string[]; postId?: string | null }) => {
		const { title, content, tags, postId } = data
		// tags 配列をカンマ区切りの文字列に変換
		const tagsString = tags.join(',')
		const articleData = { id: postId, title, content, tags: tagsString, author: 'dondonbe' }

		try {
			const response = await fetch('/api/admin_savearticle', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(articleData)
			})

			if (response.ok) {
				console.log('Article saved successfully')
				// 保存に成功した場合は、ユーザーにフィードバックを与えるか、適切なページにリダイレクトする
			} else {
				console.error('Failed to save article')
			}
		} catch (error) {
			console.error('Error saving article:', error)
		}
	}

	const formattedTags = Array.isArray(post?.data.tags) ? post.data.tags.join(', ') : post?.data.tags

	return (
		<>
			{post ? (
				<Editor
					initialTitle={post.data.title}
					initialContent={post.data.content}
					// `post.data.tags`が配列であることを確認し、そうでない場合は空文字列を使用
					initialTags={formattedTags}
					postId={typeof id === 'string' ? id : undefined}
					onSave={handleSave}
				/>
			) : (
				<div>Loading...</div>
			)}
		</>
	)
}

export default PostEditor
