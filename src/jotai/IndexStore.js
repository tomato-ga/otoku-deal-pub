import { create } from 'zustand'

const useIndexStore = create((set) => ({
	lastKeyList: {},
	setLastKeyList: (number, lastkey) =>
		set((state) => ({
			lastKeyList: {
				...state.lastKeyList,
				[`lastkey_index_page_${number}`]: lastkey
			}
		}))
}))

export default useIndexStore
