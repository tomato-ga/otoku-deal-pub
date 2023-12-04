import { create } from 'zustand'

const useDealStore = create((set) => ({
	deallastKeyList: {},
	dealsetLastKeyList: (number, lastkey) =>
		set((state) => ({
			deallastKeyList: {
				...state.lastKeyList,
				[`lastkey_deal_page_${number}`]: lastkey
			}
		}))
}))

export default useDealStore
