import React from 'react'
import Link from 'next/link'

const BreadCrumb = ({ categoryName, productName }) => {
	return (
		<div className="p-4 rounded-md text-gray-700 text-xs">
			<Link href="/" className="text-blue-600 hover:text-blue-800">
				ホーム
			</Link>
			<span className="mx-2">&gt;</span>
			<span className="text-gray-500">
				<Link href={`/category/${categoryName}/page/1`} className="text-blue-600 hover:text-blue-800">
					{categoryName}
				</Link>
			</span>
			<span className="mx-2">&gt;</span>
			<span className="text-gray-500">{productName}</span>
		</div>
	)
}

export default BreadCrumb
