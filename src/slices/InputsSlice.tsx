import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iInputSliceData = Record<
	string,
	{
		text: string
		type: "send" | "reply" | "edit"
		messageId: string
	}
>

const slice = createSlice({
	name: "inputs",
	initialState: {} as iInputSliceData,
	reducers: {
		set_input: (
			state,
			action: PayloadAction<{
				chatId: string
				text: string
				type: "send" | "reply" | "edit"
				messageId: string
			}>
		) => {
			const { chatId, text, type, messageId } = action.payload
			state[chatId] = {
				text,
				type,
				messageId
			}
		},
		reset_input: (state, action: PayloadAction<{ chatId: string }>) => {
			const { chatId } = action.payload
			state[chatId] = { text: "", type: "send", messageId: "" }
		}
	}
})

export const { set_input, reset_input } = slice.actions
export default slice.reducer
