import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

// propsの型定義を追加
interface MarkdownContentProps {
	markdownString: string
}

// propsオブジェクトを受け取るように修正
const MarkdownContent: React.FC<MarkdownContentProps> = ({ markdownString }) => {
	return (
		<div className="markdown">
			<ReactMarkdown
				children={markdownString} // childrenプロパティにmarkdownStringを渡す
				rehypePlugins={[rehypeRaw, rehypeSanitize]}
				remarkPlugins={[remarkGfm]}
			/>
		</div>
	)
}

export default MarkdownContent
