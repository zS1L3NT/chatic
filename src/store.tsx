import { configureStore } from "@reduxjs/toolkit"

import AuthReducer from "./slices/AuthSlice"
import InputsReducer from "./slices/InputsSlice"

const store = configureStore({
	devTools: { name: "Chatic" },
	reducer: {
		auth: AuthReducer,
		inputs: InputsReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
