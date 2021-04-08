import { UIDActions } from "../ReduxTypes";

const initialState = ""

const reducer = (state = initialState, action: UIDActions) => {
	switch(action.type) {
		case "Your UID was set":
			return action.uid
		default:
			return state
	}
}

export default reducer