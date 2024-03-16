import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
	markdownString: string
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ markdownString }) => {
	// Custom link component for ReactMarkdown
	const CustomLink = ({
		href,
		children,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) => {
		const isAmazonJPLink = href?.includes('amazon.co.jp') || href?.includes('amzn.to')
		const linkClassName = isAmazonJPLink ? 'markdown-amazon-button' : ''

		// Using div for Amazon links to apply additional styling
		if (isAmazonJPLink) {
			return (
				<span className="markdown-amazon-button-wrapper">
					<a href={href} {...props} className={linkClassName} target="_blank" rel="noopener noreferrer">
						{children}
					</a>
				</span>
			)
		}

		// Standard link rendering
		return (
			<a href={href} {...props} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		)
	}

	return (
		<div className="markdown">
			<ReactMarkdown
				children={markdownString}
				rehypePlugins={[rehypeRaw, rehypeSanitize]}
				remarkPlugins={[remarkGfm]}
				components={{
					// Apply the custom link component
					a: CustomLink,
					p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>
				}}
			/>
		</div>
	)
}

export default MarkdownContent
