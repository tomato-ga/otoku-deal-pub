import React, { useCallback, useMemo } from 'react'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { Editor, createEditor, Transforms, Element as SlateElement } from 'slate'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import { css, cx } from '@emotion/css'

// 基本的なButtonコンポーネント
const Button = React.forwardRef(({ className, active, reversed, ...props }, ref) => (
	<span
		{...props}
		ref={ref}
		className={cx(
			className,
			css`
				cursor: pointer;
				color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
			`
		)}
	/>
))

// アイコンを表示するコンポーネント
const Icon = React.forwardRef(({ className, ...props }, ref) => (
	<span
		{...props}
		ref={ref}
		className={cx(
			'material-icons',
			className,
			css`
				font-size: 18px;
				vertical-align: text-bottom;
			`
		)}
	/>
))

// ツールバーを表示するコンポーネント
const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
	<div
		{...props}
		ref={ref}
		className={cx(
			className,
			css`
				display: flex;
				justify-content: start;
				border-bottom: 2px solid #eee;
				margin-bottom: 20px;
			`
		)}
	/>
))

// マークボタンを追加するコンポーネント
const MarkButton = ({ format, icon }) => {
	const editor = useSlate()
	return (
		<Button
			active={isMarkActive(editor, format)}
			onMouseDown={(event) => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			<Icon>{icon}</Icon>
		</Button>
	)
}

// ショートカットキーの定義
const HOTKEYS = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
	'mod+`': 'code'
}

// リストとテキストアラインメントタイプの定義
const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const RichTextEditor = () => {
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	// ElementとLeafのレンダリング関数
	const renderElement = useCallback((props) => <Element {...props} />, [])
	const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

	return (
		<Slate editor={editor} initialValue={initialValue}>
			<Toolbar>
				<MarkButton format="bold" icon="format_bold" />
			</Toolbar>
			<Editable
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				placeholder="Enter some rich text…"
				spellCheck
				autoFocus
				onKeyDown={(event) => {
					for (const hotkey in HOTKEYS) {
						if (isHotkey(hotkey, event)) {
							event.preventDefault()
							const mark = HOTKEYS[hotkey]
							toggleMark(editor, mark)
						}
					}
				}}
			/>
		</Slate>
	)
}

// マークをトグルする関数
const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

// マークがアクティブかどうかを確認する関数
const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor)
	return marks ? marks[format] === true : false
}

// ブロックをトグルする関数
const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format)
	const isList = LIST_TYPES.includes(format)

	Transforms.unwrapNodes(editor, {
		match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
		split: true
	})

	Transforms.setNodes(editor, {
		type: isActive ? 'paragraph' : isList ? 'list-item' : format
	})

	if (!isActive && isList) {
		const block = { type: format, children: [] }
		Transforms.wrapNodes(editor, block)
	}
}

// ブロックがアクティブかどうかを確認する関数
const isBlockActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
	})

	return !!match
}

// Elementコンポーネント
const Element = ({ attributes, children, element }) => {
	switch (element.type) {
		case 'block-quote':
			return <blockquote {...attributes}>{children}</blockquote>
		case 'bulleted-list':
			return <ul {...attributes}>{children}</ul>
		case 'heading-one':
			return <h1 {...attributes}>{children}</h1>
		case 'heading-two':
			return <h2 {...attributes}>{children}</h2>
		case 'list-item':
			return <li {...attributes}>{children}</li>
		case 'numbered-list':
			return <ol {...attributes}>{children}</ol>
		default:
			return <p {...attributes}>{children}</p>
	}
}

// Leafコンポーネント
const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	if (leaf.code) {
		children = <code>{children}</code>
	}

	return <span {...attributes}>{children}</span>
}

// 初期値の定義
const initialValue = [
	{
		type: 'paragraph',
		children: [{ text: 'A line of text in a paragraph.' }]
	}
	// その他の初期値ノード
]

export default RichTextEditor
