import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import TopHeader from '@/components/TopHeader'
import Itemspagenavbar from '@/components/ItemsPage3navbar'
import MarkdownContent from '@/components/markdowncontent'

interface PostContent {
	id: string
	title: string
	content: string
	created_at: string
	tags: string[]
}

interface PostPageProps {
	post: PostContent
}

const Post: React.FC<PostPageProps> = ({ post }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	console.log(post)

	return (
		<>
			<TopHeader />
			<Itemspagenavbar />

			<div className="flex justify-center items-center m-12 text-center">
				<h1 className="text-8xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text">
					{post.title}
				</h1>
			</div>

			<div className="m-10">
				<MarkdownContent markdownString={post.content} />
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	// context.paramsがundefinedでないことを確認し、idをstring型で取得します。
	const id = context.params?.id

	// idが存在しない、または配列の場合はエラーを返します。
	if (!id || Array.isArray(id)) {
		return {
			props: {
				error: 'Invalid id'
			}
		}
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
	// 実際の環境では、外部APIを呼び出すURLや環境変数を適切に設定してください。
	const res = await fetch(`${baseUrl}/api/admin_getpostcontent?id=${id}`)
	const data = await res.json()

	// APIから取得したデータをpropsとしてページに渡す
	return { props: { post: data.data } }
}

export default Post
