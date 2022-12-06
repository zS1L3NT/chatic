import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iMessagesSliceData = Record<string, Record<string, iMessage>>

const slice = createSlice({
	name: "messages",
	initialState: {} as iMessagesSliceData,
	reducers: {
		set_messages: (state, action: PayloadAction<{ chatId: string; messages: iMessage[] }>) => {
			const { chatId, messages } = action.payload
			return {
				...state,
				[chatId]: {
					...state[chatId],
					...messages
						.filter(message => message.chatId === chatId)
						.reduce<Record<string, iMessage>>(
							(acc, message) => ({ ...acc, [message.id]: message }),
							{}
						)
				}
			}
		},
		remove_messages: (
			state,
			action: PayloadAction<{ chatId: string; messageIds: string[] }>
		) => {
			const { chatId, messageIds } = action.payload
			return {
				...state,
				[chatId]: {
					...Object.keys(state[chatId] || {})
						.filter(key => !messageIds.includes(key))
						.reduce((obj, key) => ({ ...obj, [key]: state[chatId]![key] }), {})
				}
			}
		}
	}
})

export const { set_messages, remove_messages } = slice.actions
export default slice.reducer
