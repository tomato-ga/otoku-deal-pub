import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

const MarkdownContent = (markdownString) => {
	return (
		<div className="markdown">
			<ReactMarkdown
				children={markdownString}
				rehypePlugins={[rehypeRaw, rehypeSanitize]}
				remarkPlugins={[remarkGfm]}
			/>
		</div>
	)
}

export default MarkdownContent
