import React, { useState, DragEvent } from 'react'

// TODO 画像アップロードと、記事DB保存は別の処理にわけるのが適切

const FileUploadArea: React.FC<{ onFileSelected: (files: File[]) => void }> = ({ onFileSelected }) => {
	const [dragOver, setDragOver] = useState<boolean>(false)
	const [selectedFileName, setSelectedFileName] = useState<string>('')
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
		const files = Array.from(e.dataTransfer.files)
		setSelectedFiles(files)
		onFileSelected(files) // 親コンポーネントに選択されたファイルの配列を渡す
	}

	return (
		<div
			className={`drop-area ${dragOver ? 'drag-over' : ''}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			ファイルをここにドロップ
			{selectedFiles.map((file, index) => (
				<div key={index}>選択されたファイル: {file.name}</div>
			))}
		</div>
	)
}

export default FileUploadArea
