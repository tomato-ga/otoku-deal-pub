import SideCategoryLinks from './SideCategoryLinks'
import useSidebarStore from '@/jotai/Store'

const Sidebar = () => {
	const sidebarOpen = useSidebarStore((state) => state.sidebarOpen)

	return (
		<div
			className={`bg-white p-4 order-2 md:order-1 transform ${
				sidebarOpen ? 'translate-x-0' : '-translate-x-full'
			} transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 xl:relative xl:translate-x-0 z-20`}
		>
			<div className="text-black">
				<SideCategoryLinks />
			</div>
		</div>
	)
}

export default Sidebar