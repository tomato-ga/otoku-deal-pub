import React from 'react'

interface PreviewProps {
	title: string
	content: string
	tags: string[]
}

const Preview: React.FC<PreviewProps> = ({ title, content, tags }) => {
	return (
		<div>
			<h1>{title}</h1>
			<div dangerouslySetInnerHTML={{ __html: content }} />
			<div>
				<strong>Tags:</strong>
				{tags.map((tag, index) => (
					<span key={index}>{tag}</span>
				))}
			</div>
		</div>
	)
}

export default Preview
