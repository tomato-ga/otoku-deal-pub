// components/FileUploadArea.tsx
import React, { useState, DragEvent } from 'react'

interface FileUploadAreaProps {
	onFileSelected: (files: File[]) => void
	onUpload: (files: File[]) => Promise<void> // 画像アップロードのための関数をPropsとして受け取る
	onUploadSuccess: () => void
	onUploadFailure: (error: string) => void
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
	onFileSelected,
	onUpload,
	onUploadSuccess,
	onUploadFailure
}) => {
	const [dragOver, setDragOver] = useState<boolean>(false)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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
		const files = Array.from(e.dataTransfer.files) // ドロップされたファイルの配列
		setSelectedFiles((prevFiles) => [...prevFiles, ...files]) // 既存のファイルリストに新しいファイルを追加
		onFileSelected([...selectedFiles, ...files]) // 親コンポーネントへの通知も、全ファイルを含むように更新
	}

	// 新しい関数: 画像アップロード処理を呼び出す
	const handleUpload = async () => {
		try {
			await onUpload(selectedFiles)
			onUploadSuccess()
			setSelectedFiles([]) // アップロード後、選択されたファイルリストをクリア
		} catch (error) {
			onUploadFailure(error instanceof Error ? error.message : String(error))
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
			{selectedFiles.map((file, index) => (
				<div key={index}>選択されたファイル: {file.name}</div>
			))}
			{/* 画像アップロードボタンを追加 */}
			<button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded mt-4">
				画像アップロード
			</button>
		</div>
	)
}

export default FileUploadArea
