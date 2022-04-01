import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iChatsData = Record<string, iChat>

const slice = createSlice({
	name: "chats",
	initialState: {} as iChatsData,
	reducers: {
		set_chats: (_, action: PayloadAction<iChatsData>) => {
			return action.payload
		},
		set_chat: (state, action: PayloadAction<iChat>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_chat: (state, action: PayloadAction<iChat>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_chats, set_chat, remove_chat } = slice.actions
export default slice.reducer
