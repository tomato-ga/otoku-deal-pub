import Link from 'next/link'
import useSidebarStore from '@/jotai/Store'

import TvIcon from '@mui/icons-material/Tv'
import ComputerIcon from '@mui/icons-material/Computer'
import KitchenIcon from '@mui/icons-material/Kitchen'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import RamenDiningIcon from '@mui/icons-material/RamenDining'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import MedicationIcon from '@mui/icons-material/Medication'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'
import BuildIcon from '@mui/icons-material/Build'
import ToysIcon from '@mui/icons-material/Toys'
import PetsIcon from '@mui/icons-material/Pets'
import HomeIcon from '@mui/icons-material/Home'

const SideCategoryLinks = () => {
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
	const handleHomeClick = () => {
		toggleSidebar()
	}

	return (
		<div className="flex flex-col items-start space-y-4">
			<Link href={`/`}>
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<HomeIcon className="text-xl" />
					<span className="pl-2">ホーム</span>
				</div>
			</Link>
			<Link href={`/category/${encodeURIComponent('家電＆カメラ')}/page/1`}>
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<TvIcon className="text-xl" />
					<span className="pl-2">家電＆カメラ</span>
				</div>
			</Link>

			<Link href={`/category/${encodeURIComponent('パソコン・周辺機器')}/page/1`}>
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-bold"
				>
					<ComputerIcon className="text-xl" />
					<span className="pl-2">パソコン・周辺機器</span>
				</div>
			</Link>

			<Link href={`/category/${`ホーム＆キッチン`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<KitchenIcon className="text-xl" />
					<span className="pl-2">ホーム＆キッチン</span>
				</div>
			</Link>

			<Link href={`/category/${`スポーツ＆アウトドア`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<DirectionsRunIcon className="text-xl" />
					<span className="pl-2">スポーツ＆アウトドア</span>
				</div>
			</Link>

			<Link href={`/category/${`食品・飲料・お酒`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<RamenDiningIcon className="text-xl" />
					<span className="pl-2">食品・飲料・お酒</span>
				</div>
			</Link>

			<Link href={`/category/${`ゲーム`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<SportsEsportsIcon className="text-xl" />
					<span className="pl-2">ゲーム</span>
				</div>
			</Link>

			<Link href={`/category/${`ドラッグストア`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<MedicationIcon className="text-xl" />
					<span className="pl-2">ドラッグストア</span>
				</div>
			</Link>

			<Link href={`/category/${`ファッション`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<AccessibilityIcon className="text-xl" />
					<span className="pl-2">ファッション</span>
				</div>
			</Link>

			<Link href={`/category/${`ビューティー`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<FaceRetouchingNaturalIcon className="text-xl" />
					<span className="pl-2">ビューティー</span>
				</div>
			</Link>

			<Link href={`/category/${`DIY・工具・ガーデン`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<BuildIcon className="text-xl" />
					<span className="pl-2">DIY・工具・ガーデン</span>
				</div>
			</Link>

			<Link href={`/category/${`おもちゃ`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<ToysIcon className="text-xl" />
					<span className="pl-2">おもちゃ</span>
				</div>
			</Link>

			<Link href={`/category/${`ペット用品`}/page/1`} className="text-blue-600 hover:text-blue-800">
				<div
					onClick={handleHomeClick}
					className="flex items-center gap-2 text-lg md:text-xl lg:text-xl text-gray-600 hover:text-blue-800 cursor-pointer font-semibold"
				>
					<PetsIcon className="text-xl" />
					<span className="pl-2">ペット用品</span>
				</div>
			</Link>
		</div>
	)
}

export default SideCategoryLinks
