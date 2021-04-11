import {
	SAVING_PFP,
	SAVED_PFP,
	DELETING_PFP,
	DELETED_PFP,
	SAVING_PSWD,
	SAVED_PSWD
} from "../actions/types"

const initialState = {
	savingpfp: false,
	deletingpfp: false,
	savingpswd: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SAVING_PFP:
			return {
				...state,
				savingpfp: true
			}
		case SAVED_PFP:
			return {
				...state,
				savingpfp: false
			}
		case DELETING_PFP:
			return {
				...state,
				deletingpfp: true
			}
		case DELETED_PFP:
			return {
				...state,
				deletingpfp: false
			}
		case SAVING_PSWD:
			return {
				...state,
				savingpswd: true
			}
		case SAVED_PSWD:
			return {
				...state,
				savingpswd: false
			}
		default:
			return state
	}
}
