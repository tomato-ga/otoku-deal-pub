import React, { useState, DragEvent } from 'react'
import { S3Client } from '@aws-sdk/client-s3'

const FileUploadArea: React.FC = () => {
	const [dragOver, setDragOver] = useState<boolean>(false)

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault() // デフォルトの挙動を防ぐ
		setDragOver(true)
	}

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(false)
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(false)
		const files = e.dataTransfer.files
		if (files.length > 0) {
			const file = files[0]
			uploadFile(file) // ファイルをアップロードする関数を呼び出す
		}
	}
	// FileUploadArea コンポーネント内に追加

	const uploadFile = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/admin_s3upload', {
				method: 'POST',
				body: formData
			})

			if (response.ok) {
				const data = await response.json()
				console.log('アップロード成功:', data)
				// 成功した場合の処理
			} else {
				// サーバーからのエラー処理
				console.error('アップロードに失敗しました。')
			}
		} catch (error) {
			console.error('アップロード中にエラーが発生しました:', error)
		}
	}

	// 環境変数から値を取得し、undefined であればデフォルト値を使用
	const region = process.env.AWS_REGION || 'ap-northeast-1' // デフォルトのリージョンを設定
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID || ''
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || ''

	const s3 = new S3Client({
		region: region,
		credentials: {
			accessKeyId: accessKeyId,
			secretAccessKey: secretAccessKey
		}
	})

	return (
		<div
			className={`drop-area ${dragOver ? 'drag-over' : ''}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			ファイルをここにドロップ
		</div>
	)
}

export default FileUploadArea
