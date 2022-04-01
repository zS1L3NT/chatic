import ChatsReducer from "./slices/ChatsSlice"
import FriendshipsReducer from "./slices/FriendshipsSlice"
import HandshakesReducer from "./slices/HandshakesSlice"
import MessagesReducer from "./slices/MessagesSlice"
import PresencesReducer from "./slices/PresencesSlice"
import StatusesReducer from "./slices/StatusesSlice"
import UsersReducer from "./slices/UsersSlice"
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
	reducer: {
		chats: ChatsReducer,
		friendships: FriendshipsReducer,
		handshakes: HandshakesReducer,
		messages: MessagesReducer,
		presences: PresencesReducer,
		statuses: StatusesReducer,
		users: UsersReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
