import { useState } from 'react'

// TODO Basic認証かける

const Editor = () => {
	const [titleTextArea, setTitleTextArea] = useState('')
	const handleTextAreaChange = (event) => {
		setTitleTextArea(event.target.value)
	}

	return (
		<>
			<div className="flex items-center justify-center flex-col">
				<h1 className="items-center text-2xl mt-4 border-b-2">タイトル</h1>
				<textarea
					value={titleTextArea}
					onChange={handleTextAreaChange}
					rows="3"
					cols="100"
					placeholder="タイトル入力"
					className="border-2 m-5"
				></textarea>
			</div>
		</>
	)
}

export default Editor
