import { GETTING_ERRORS, CLEARED_ERRORS } from "../actions/types"

const initialState = {
	msg: "",
	status: null,
	id: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case GETTING_ERRORS:
			return {
				msg: action.payload.msg,
				status: action.payload.status,
				id: action.payload.id
			}
		case CLEARED_ERRORS:
			return {
				msg: "",
				status: null,
				id: null
			}
		default:
			return state
	}
}
