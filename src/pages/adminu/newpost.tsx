import { useEffect, useState, ChangeEvent } from 'react' // ChangeEvent をインポート
import useAuthStore from '@/jotai/authStore'
import { useRouter } from 'next/router'

import AdminLayout from '@/components/AdminLayout'
import FileUploadArea from '@/components/drag'
import Preview from './preview'

interface UploadResponse {
	urls: string[]
}

interface EditorProps {
	initialTitle?: string
	initialContent?: string
	initialTags?: string
	postId?: string | null
	onSave: (data: { title: string; content: string; tags: string[]; postId?: string | null }) => void
}

const Editor: React.FC<EditorProps> = ({
	initialTitle = '', // デフォルト値を空文字に設定
	initialContent = '', // デフォルト値を空文字に設定
	initialTags = '', // デフォルト値を空文字に設定
	postId,
	onSave
}) => {
	const [title, setTitle] = useState<string>(initialTitle)
	const [content, setContent] = useState<string>(initialContent)
	const [tags, setTags] = useState<string>(initialTags)
	const author = 'dondonbe'
	const [showPreview, setShowPreview] = useState(false)

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

	const handleNewSave = async () => {
		// タグがカンマ区切りの文字列として保存されていると仮定し、配列に変換
		const tagsArray = tags.split(',').map((tag) => tag.trim()) // タグをトリムして余分な空白を削除
		const articleData = {
			title,
			content,
			tags: tagsArray, // 文字列から配列に変換したタグデータを使用
			author
		}

		try {
			const response = await fetch(postId ? `/api/admin_updatearticle/${postId}` : '/api/admin_newarticle', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(articleData)
			})

			if (response.ok) {
				showToast('記事がデータベースに保存されました')
			} else {
				showToast('記事の保存に失敗しました')
			}
		} catch (error) {
			showToast('保存中にエラーが発生しました')
		}
	}

	// TODO 編集更新の場合、タグがDBに保存されない
	// 保存ボタンクリック時のハンドラ
	const handleButtonClick = async () => {
		if (onSave) {
			try {
				// onSaveが提供されている場合は、タグを配列に変換する処理を呼び出し側で行う必要がある
				const tagsArray = tags.split(',').map((tag) => tag.trim())
				onSave({ title, content, tags: tagsArray, postId })
				showToast('記事が正常に保存されました。')
			} catch (error) {
				showToast('記事の保存中にエラーが発生しました。')
				console.error(error)
			}
		} else {
			// onSaveが提供されていない場合は、ローカルの保存処理を実行
			await handleNewSave()
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

			const data = await response.json() // 常に最初にレスポンスのJSONをパースする
			console.log('アップロードしたdata構造確認', data.urls)

			if (!response.ok) {
				// APIからのエラーメッセージを取得して表示
				const errorMessage = data.error || 'アップロード失敗'
				console.error('アップロードエラー:', errorMessage)
				showToast(`画像アップロードエラー: ${errorMessage}`)
				return // ここで処理を中断
			}

			// アップロード成功時の処理（マークダウン形式で画像を表示）
			let markdownImages = data.urls
				.map((url: string) => {
					// URLからファイル名を抽出（'uploads/'以降の部分）
					const fileName = url.split('/').pop() // URLを'/'で分割し、最後の要素（ファイル名）を取得
					// マークダウン形式で画像を挿入（ファイル名を代替テキストとして使用）
					return `![${fileName}](${url})`
				})
				.join('\n')
			setContent((prev) => `${prev}\n${markdownImages}`)
			showToast('画像アップロード成功')
		} catch (error) {
			// ネットワークエラーやレスポンスのJSONパース失敗など
			console.error('アップロード中にエラーが発生しました:', error)
			showToast('画像アップロード中にエラーが発生しました')
		}
	}

	const togglePreview = () => {
		setShowPreview(!showPreview)
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

				<button onClick={handleButtonClick} className="bg-blue-500 text-white p-2 rounded mt-4">
					保存
				</button>
				{toast.show && <span className="ml-4 text-green-600">{toast.message}</span>}

				{toast.show && (
					<div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 border border-blue-300 shadow-lg rounded-md bg-blue-100 text-blue-800">
						{toast.message}
					</div>
				)}

				<div>
					{showPreview ? (
						<Preview title={title} content={content} tags={tags} />
					) : (
						// 編集画面のコンポーネント
						<>
							<button onClick={togglePreview}>Preview</button>
						</>
					)}
				</div>
			</div>
		</AdminLayout>
	)
}

export default Editor
