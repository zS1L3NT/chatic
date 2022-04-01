import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type iFriendshipsData = Record<string, iFriendship>

const slice = createSlice({
	name: "friendships",
	initialState: {} as iFriendshipsData,
	reducers: {
		set_friendships: (_, action: PayloadAction<iFriendshipsData>) => {
			return action.payload
		},
		set_friendship: (state, action: PayloadAction<iFriendship>) => {
			Object.assign(state, { [action.payload.id]: action.payload })
		},
		remove_friendship: (state, action: PayloadAction<iFriendship>) => {
			delete state[action.payload.id]
		}
	}
})

export const { set_friendships, set_friendship, remove_friendship } = slice.actions
export default slice.reducer
