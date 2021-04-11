import { combineReducers } from "redux"
import authReducer from "./authReducer"
import errorReducer from "./errorReducer"
import chatReducer from "./chatReducer"
import browserReducer from "./browserReducer"
import loadingReducer from "./loadingReducer"

export default combineReducers({
	browser: browserReducer,
	auth: authReducer,
	chat: chatReducer,
	loading: loadingReducer,
	error: errorReducer
})
