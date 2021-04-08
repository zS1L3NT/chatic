import { ActiveActions } from "../ReduxTypes"

const initialState: boolean | null = null

const reducer = (state: boolean | null = initialState, action: ActiveActions) => {
	switch (action.type) {
		case "Set activity":
			return action.active
		default:
			return state
	}
}

export default reducer
