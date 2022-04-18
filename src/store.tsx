import { configureStore } from "@reduxjs/toolkit"

import AuthReducer from "./slices/AuthSlice"

const store = configureStore({
	devTools: { name: "Chatic" },
	reducer: {
		auth: AuthReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
