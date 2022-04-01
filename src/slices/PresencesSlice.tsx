import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iPresencesData = Record<string, iPresence>

const slice = createSlice({
	name: "presences",
	initialState: {} as iPresencesData,
	reducers: {
		set_presences: (_, action: PayloadAction<iPresencesData>) => {
			return action.payload
		},
		set_presence: (state, action: PayloadAction<iPresence>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_presence: (state, action: PayloadAction<iPresence>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_presences, set_presence, remove_presence } = slice.actions
export default slice.reducer
