import Link from 'next/link'

export default function Footer() {
	return (
		<footer className="bg-black text-white p-4 text-center mt-10">
			<div className="container mx-auto">
				<div className="flex justify-center items-center space-x-4">
					<Link href="/">
						<span className="cursor-pointer hover:underline">ホーム</span>
					</Link>
					{/* <Link href="/about">
						<span className="cursor-pointer hover:underline">私たちについて</span>
					</Link> */}
					<Link href="/contact">
						<span className="cursor-pointer hover:underline">お問い合わせ</span>
					</Link>
				</div>
				<p className="text-white text-sm mt-4">© {new Date().getFullYear()} セールまとめ</p>
			</div>
		</footer>
	)
}
