import Link from 'next/link'

const Testnav = () => {
	return (
		<nav className="bg-gray-50 dark:bg-gray-700">
			<div className="max-w-screen-xl px-4 py-3 mx-auto">
				<div className="flex items-center justify-center">
					<ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
						<li>
							<Link href={`/`}>
								<span className=" hidden sm:inline pl-2 pr-2 ">ホーム</span>
							</Link>
						</li>
						<li>
							<Link href={`/category/${encodeURIComponent('家電＆カメラ')}/page/1`}>
								<span className=" hidden sm:inline pl-2 pr-2">家電＆カメラ</span>
							</Link>
						</li>
						<li>
							<Link href={`/category/${encodeURIComponent('パソコン・周辺機器')}/page/1`}>
								<span className=" hidden sm:inline pl-2 pr-2">パソコン・周辺機器</span>
							</Link>
						</li>

						<li>
							<Link href={`/category/${`ホーム＆キッチン`}/page/1`} className="text-blue-600 hover:text-orange-200">
								<span className=" hidden sm:inline pl-2 pr-2">ホーム＆キッチン</span>
							</Link>
						</li>

						<li>
							<Link href={`/category/${`スポーツ＆アウトドア`}/page/1`} className="text-blue-600 hover:text-orange-200">
								<span className=" hidden sm:inline pl-2 pr-2">スポーツ＆アウトドア</span>
							</Link>
						</li>

						<li>
							<Link href={`/category/${`食品・飲料・お酒`}/page/1`} className="text-blue-600 hover:text-orange-200">
								<span className=" hidden sm:inline pl-2 pr-2">食品・飲料・お酒</span>
							</Link>
						</li>
						<li>
							<Link href={`/category/${`ゲーム`}/page/1`} className="text-blue-600 hover:text-orange-200">
								<span className=" hidden sm:inline pl-2 pr-2">ゲーム</span>
							</Link>
						</li>

						<Link href={`/category/${`ドラッグストア`}/page/1`} className="text-blue-600 hover:text-orange-200">
							<span className=" hidden sm:inline pl-2 pr-2">ドラッグストア</span>
						</Link>

						<Link href={`/category/${`ファッション`}/page/1`} className="text-blue-600 hover:text-orange-200">
							<span className=" hidden sm:inline pl-2 pr-2">ファッション</span>
						</Link>

						<Link href={`/category/${`ビューティー`}/page/1`} className="text-blue-600 hover:text-orange-200">
							<span className=" hidden sm:inline pl-2 pr-2">ビューティー</span>
						</Link>

						<Link href={`/category/${`DIY・工具・ガーデン`}/page/1`} className="text-blue-600 hover:text-orange-200">
							<span className=" hidden sm:inline pl-2 pr-2">DIY・工具・ガーデン</span>
						</Link>

						<Link href={`/category/${`おもちゃ`}/page/1`} className="text-blue-600 hover:text-orange-200">
							<span className=" hidden sm:inline pl-2 pr-2">おもちゃ</span>
						</Link>

						<Link href={`/category/${`ペット用品`}/page/1`} className="text-blue-600 hover:text-orange-200">
							<span className=" hidden sm:inline pl-2 pr-2">ペット用品</span>
						</Link>
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Testnav
