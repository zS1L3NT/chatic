import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import cids from "./redux/reducers/CIDsReducer"
import ipv4 from "./redux/reducers/IPV4Reducer"
import active from "./redux/reducers/ActiveReducer"
import listeners from "./redux/reducers/ListenersReducer"
import message from "./redux/reducers/MessageReducer"
import uid from "./redux/reducers/UIDReducer"

const rootReducer = combineReducers({ uid, ipv4, active, cids, message, listeners })

const composeEnhancers = composeWithDevTools({ trace: true })

const store = createStore(
	rootReducer,
	{},
	composeEnhancers(applyMiddleware(thunk))
)

export type AppState = ReturnType<typeof rootReducer>
export type Istore = typeof store
export default store
