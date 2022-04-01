import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iStatusesData = Record<string, iStatus>

const slice = createSlice({
	name: "statuses",
	initialState: {} as iStatusesData,
	reducers: {
		set_statuses: (_, action: PayloadAction<iStatusesData>) => {
			return action.payload
		},
		set_status: (state, action: PayloadAction<iStatus>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_status: (state, action: PayloadAction<iStatus>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_statuses, set_status, remove_status } = slice.actions
export default slice.reducer
