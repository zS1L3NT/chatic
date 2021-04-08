import { IPV4Actions } from "../ReduxTypes"

const initialState = ""

const reducer = (state = initialState, action: IPV4Actions) => {
	switch (action.type) {
		case "Your IPV4 was set":
			return action.ipv4
		default:
			return state
	}
}

export default reducer
