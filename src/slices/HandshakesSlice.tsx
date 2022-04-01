import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iHandshakesData = Record<string, iHandshake>

const slice = createSlice({
	name: "handshakes",
	initialState: {} as iHandshakesData,
	reducers: {
		set_handshakes: (_, action: PayloadAction<iHandshakesData>) => {
			return action.payload
		},
		set_handshake: (state, action: PayloadAction<iHandshake>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_handshake: (state, action: PayloadAction<iHandshake>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_handshakes, set_handshake, remove_handshake } = slice.actions
export default slice.reducer
