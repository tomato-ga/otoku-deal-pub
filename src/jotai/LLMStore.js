import { create } from 'zustand'

const useLLMStore = create((set) => ({
	llmlastKeyList: {},
	llmsetLastKeyList: (number, lastkey) =>
		set((state) => ({
			llmlastKeyList: {
				...state.llmlastKeyList,
				[`lastkey_llm_page_${number}`]: lastkey
			}
		}))
}))

export default useLLMStore
