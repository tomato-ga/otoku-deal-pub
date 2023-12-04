import { create } from 'zustand'

const useCategoryStore = create((set) => ({
	lastKeyList: {},
	setLastKeyList: (categoryname, number, lastkey) =>
		set((state) => ({
			lastKeyList: {
				...state.lastKeyList,
				[`lastkey_category_page_${categoryname}_${number}`]: lastkey
			}
		}))
}))

export default useCategoryStore
