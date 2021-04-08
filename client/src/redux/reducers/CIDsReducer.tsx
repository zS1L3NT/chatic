import { CIDsActions } from "../ReduxTypes"

const initialState: string[] = []

const reducer = (state = initialState, action: CIDsActions) => {
	switch (action.type) {
		case "Got your chat list":
			return action.cids
		default:
			return state
	}
}

export default reducer