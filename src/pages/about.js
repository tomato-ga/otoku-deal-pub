import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import TopHeader from '@/components/TopHeader'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

export default function About() {
	return (
		<>
			<TopHeader />

			<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
				<div className="w-full md:w-full p-4 bg-white order-1 md:order-2">
					このサイトは、お得なセール情報を毎日朝に更新しています。
					ただただお得な情報を眺めて、気になったものを探してもらえればと思って作っています。
				</div>
			</div>

			<Footer />
		</>
	)
}
