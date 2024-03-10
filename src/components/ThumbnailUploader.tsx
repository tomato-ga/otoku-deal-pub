import React, { useState, DragEvent } from 'react'

interface ThumbnailUploaderProps {
	postId: string
	onUploadSuccess: () => void
	onUploadFailure: (error: string) => void
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ postId, onUploadSuccess, onUploadFailure }) => {
	const [dragOver, setDragOver] = useState<boolean>(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(true)
	}

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(false)
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(false)
		const file = e.dataTransfer.files[0] || null
		setSelectedFile(file)
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null
		console.log('Selected file:', file)
		setSelectedFile(file)
	}

	const handleUpload = async () => {
		if (!selectedFile) return

		const formData = new FormData()
		formData.append('files', selectedFile)

		try {
			const response = await fetch('/api/admin_s3upload', {
				method: 'POST',
				body: formData // 更新部分
			})
			const data = await response.json()

			const handleThumbnailSQLUpdate = async (thumbUrl: string) => {
				try {
					const response = await fetch('/api/admin_savethumburl', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ thumbUrl, postId })
					})

					await response.json()
					onUploadSuccess()
				} catch (err) {
					console.log(err)
					onUploadFailure(err instanceof Error ? err.message : String(err))
				}
			}

			if (response.ok) {
				const thumbUrl = data.urls[0]
				console.log(thumbUrl) // returnでAWS S3のアップロードURLが返ってきている
				handleThumbnailSQLUpdate(thumbUrl)
			} else {
				console.error('Image upload failed:', data.error)
				alert(`Image upload failed: ${data.error}`) // ユーザーにエラーメッセージを表示
			}
		} catch (error) {
			console.error('Error uploading image:', error)
			alert('An error occurred while uploading the image.') // ユーザーにエラーメッセージを表示
		}
	}

	return (
		<div
			className={`drop-area ${dragOver ? 'drag-over' : ''}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p>ファイルをここにドロップ</p>
			{selectedFile && <div>選択されたファイル: {selectedFile.name}</div>}
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded mt-4">
				Upload Thumbnail
			</button>
		</div>
	)
}

export default ThumbnailUploader
