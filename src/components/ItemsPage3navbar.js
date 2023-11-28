import Link from 'next/link'

const Itemspagenavbar = () => {
	return (
		<nav className="hidden md:flex h-12 pl-3 bg-[#232e3e]">
			<div className="max-w-screen flex items-center justify-between mx-auto p-3 overflow-x-scroll">
				{/* Links for all screen sizes */}
				<div className="flex items-center space-x-2">
					<Link href={`/`}>
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2 ">ホーム</span>
						</div>
					</Link>

					<Link href={`/category/${encodeURIComponent('家電＆カメラ')}/page/1`}>
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">家電＆カメラ</span>
						</div>
					</Link>
					<Link href={`/category/${encodeURIComponent('パソコン・周辺機器')}/page/1`}>
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">パソコン・周辺機器</span>
						</div>
					</Link>

					<Link href={`/category/${`ホーム＆キッチン`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">ホーム＆キッチン</span>
						</div>
					</Link>

					<Link href={`/category/${`スポーツ＆アウトドア`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">スポーツ＆アウトドア</span>
						</div>
					</Link>

					<Link href={`/category/${`食品・飲料・お酒`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">食品・飲料・お酒</span>
						</div>
					</Link>
					<Link href={`/category/${`ゲーム`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">ゲーム</span>
						</div>
					</Link>

					<Link href={`/category/${`ドラッグストア`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">ドラッグストア</span>
						</div>
					</Link>

					<Link href={`/category/${`ファッション`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap ">
							<span className=" hidden sm:inline pl-2 pr-2">ファッション</span>
						</div>
					</Link>

					<Link href={`/category/${`ビューティー`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap">
							<span className=" hidden sm:inline pl-2 pr-2">ビューティー</span>
						</div>
					</Link>

					<Link href={`/category/${`DIY・工具・ガーデン`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap ">
							<span className=" hidden sm:inline pl-2 pr-2">DIY・工具・ガーデン</span>
						</div>
					</Link>

					<Link href={`/category/${`おもちゃ`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap ">
							<span className=" hidden sm:inline pl-2 pr-2">おもちゃ</span>
						</div>
					</Link>

					<Link href={`/category/${`ペット用品`}/page/1`} className="">
						<div className="text-base  md:text-base  text-white hover:text-orange-200 cursor-pointer whitespace-nowrap ">
							<span className=" hidden sm:inline pl-2 pr-2">ペット用品</span>
						</div>
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Itemspagenavbar
