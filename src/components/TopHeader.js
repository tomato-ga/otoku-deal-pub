import Link from 'next/link'
import { useState } from 'react'
import useSidebarStore from '@/jotai/Store'

const TopHeader = (props) => {
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
	const { isPage } = props

	return (
		<header className="relative">
			{/* Upper Section */}
			<div className="flex items-center h-12 pl-3 justify-between bg-[#141921] border-t-2 border-orange-300 ">
				{/* Logo/Title */}
				<Link href="/">
					<div className="flex items-center">
						<img src="/logo.png" alt="激安特価セール速報" className="h-8" />
						<span className="text-white px-3  rounded-sm cursor-pointer font-bold">激安特価セール速報</span>
					</div>
				</Link>

				{/* 個別ページはisPage == true */}
				{isPage ? (
					<button
						className="sm:inline md:hidden lg:hidden xl:hidden 2xl:hidden absolute items-center top-3 right-2 mr-2 z-50 text-gray-500"
						onClick={toggleSidebar}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				) : (
					<button
						className="sm:inline md:inline lg:inline xl:hidden absolute items-center top-3 right-2 mr-2 z-50 text-gray-500"
						onClick={toggleSidebar}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				)}
				{/* <button className="sm:inline md:inline lg:inline xl:hidden absolute items-center top-3 right-2 mr-2 z-50 text-gray-500" onClick={toggleSidebar}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button> */}
			</div>

			{/* Lower Section */}
			<nav className="flex items-center h-12 pl-3 justify-between bg-[#232e3e]">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
					{/* Links for all screen sizes */}
					<div className="flex space-x-2 lg:space-x-4">
						<Link href="/group/page/1">
							<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
								グループセール
							</span>
						</Link>
						<Link href="/rireki">
							<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
								閲覧履歴
							</span>
						</Link>
					</div>
				</div>
			</nav>
		</header>
	)
}

export default TopHeader
