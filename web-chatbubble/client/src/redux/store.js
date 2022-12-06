import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import rootReducer from "./reducers"

const initialState = {}
const composeEnhancers = composeWithDevTools({ trace: true })

const store = createStore(
	rootReducer,
	initialState,
	composeEnhancers(applyMiddleware(thunk))
)

export default store
