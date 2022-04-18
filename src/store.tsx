import { configureStore } from "@reduxjs/toolkit"

import AuthReducer from "./slices/AuthSlice"
import InputsReducer from "./slices/InputsSlice"
import MessagesReducer from "./slices/MessagesSlice"

const store = configureStore({
	devTools: { name: "Chatic" },
	reducer: {
		auth: AuthReducer,
		inputs: InputsReducer,
		messages: MessagesReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
