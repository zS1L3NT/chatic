import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iUsersData = Record<string, iUser>

const slice = createSlice({
	name: "users",
	initialState: {} as iUsersData,
	reducers: {
		set_users: (_, action: PayloadAction<iUsersData>) => {
			return action.payload
		},
		set_user: (state, action: PayloadAction<iUser>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_user: (state, action: PayloadAction<iUser>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_users, set_user, remove_user } = slice.actions
export default slice.reducer
