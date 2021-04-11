import { IS_MOBILE, IS_DESKTOP } from "../actions/types"

const initialState = ""

export default (state = initialState, action) => {
	switch (action.type) {
		case IS_MOBILE:
			return "mobile"
		case IS_DESKTOP:
			return "desktop"
		default:
			return state
	}
}
