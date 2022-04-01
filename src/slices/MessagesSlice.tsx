import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iMessagesData = Record<string, iMessage>

const slice = createSlice({
	name: "messages",
	initialState: {} as iMessagesData,
	reducers: {
		set_messages: (_, action: PayloadAction<iMessagesData>) => {
			return action.payload
		},
		set_message: (state, action: PayloadAction<iMessage>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_message: (state, action: PayloadAction<iMessage>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_messages, set_message, remove_message } = slice.actions
export default slice.reducer
