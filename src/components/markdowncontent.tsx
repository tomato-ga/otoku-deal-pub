import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
	markdownString: string
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ markdownString }) => {
	// nodeプロパティを削除して、propsのみを使用
	const customLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
		// アマゾン.co.jpへのリンクにのみ特別なスタイルを適用し、
		// すべてのリンクを新しいタブで開くようにする
		const isAmazonJPLink = props.href?.includes('amazon.co.jp')
		const className = isAmazonJPLink ? 'markdown-amazon-button' : ''

		return (
			<a
				{...props}
				className={className + (props.className ? ' ' + props.className : '')}
				target="_blank" // 新しいタブでリンクを開く
				rel="noopener noreferrer" // セキュリティ対策
			/>
		)
	}

	return (
		<div className="markdown">
			<ReactMarkdown
				children={markdownString}
				rehypePlugins={[rehypeRaw, rehypeSanitize]}
				remarkPlugins={[remarkGfm]}
				components={{
					a: customLink // リンクにカスタムコンポーネントを適用
				}}
			/>
		</div>
	)
}

export default MarkdownContent
