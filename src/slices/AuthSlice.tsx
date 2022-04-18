import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iAuthSliceData = iUser | null

const slice = createSlice({
	name: "auth",
	initialState: null as iAuthSliceData,
	reducers: {
		set_auth: (state, action: PayloadAction<iAuthSliceData>) => {
			return action.payload
		}
	}
})

export const { set_auth } = slice.actions
export default slice.reducer
