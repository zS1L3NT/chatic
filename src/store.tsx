import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
	devTools: { name: "Chatic" },
	reducer: {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
