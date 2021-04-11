import {
	CHECKING_AUTH,
	AUTH_SUCCESS,
	AUTH_FAIL,
	LOADING_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOADING_REGISTER,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGOUT_SUCCESS
} from "../actions/types"

const initialState = {
	token: localStorage.getItem("token"),
	isAuthenticated: false,
	isLoading: false,
	user: {
		_id: "",
		usnm: "",
		eml: "",
		phnm: "",
		pfp: ""
	}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case CHECKING_AUTH:
		case LOADING_LOGIN:
		case LOADING_REGISTER:
			return {
				...state,
				isLoading: true
			}
		case AUTH_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				user: action.payload
			}
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			localStorage.setItem("token", action.payload.token)
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				isLoading: false
			}
		case AUTH_FAIL:
		case LOGIN_FAIL:
		case LOGOUT_SUCCESS:
		case REGISTER_FAIL:
			localStorage.removeItem("token")
			return {
				...state,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				user: {
					_id: "",
					usnm: "",
					eml: "",
					phnm: "",
					pfp: ""
				}
			}
		default:
			return state
	}
}
