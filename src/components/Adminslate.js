// /Volumes/SSD_1TB/otoku-deal/src/components/Adminslate.js

import { useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const RichTextEditor = ({ onChange, value }) => {
	// エディタのインスタンス生成
	const editor = useMemo(() => withReact(createEditor()), [])

	// エディタ値変更ハンドラ
	const handleChange = (newValue) => {
		onChange(newValue) // newValueを使用して、引数の名前を変更
	}

	return (
		<Slate editor={editor} value={value} onChange={handleChange}>
			<Editable className="w-full max-w-lg border-2 m-2 p-2" placeholder="コンテンツをここに入力" />
		</Slate>
	)
}

export default RichTextEditor
