import axios from "axios"
import { returnErrors, clearErrors } from "./errorActions"
import {
	savingpfp,
	savedpfp,
	deletingpfp,
	deletedpfp,
	savingpswd,
	savedpswd
} from "./loadingActions"
import { clearChats } from "./chatActions"
import { socket } from "../../App"

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

// Get user data from MongoDB
// use the 'getState' only when you need to get the token
export const GetUserData = _ => (dispatch, getState) => {
	dispatch({ type: CHECKING_AUTH })

	axios
		.get("/api/account/getData", tokenConfig(getState))
		.then(res =>
			dispatch({
				type: AUTH_SUCCESS,
				payload: res.data
			})
		)
		.catch(err => {
			dispatch(returnErrors(err.response.data, err.response.status))
			dispatch({ type: AUTH_FAIL })
		})
}

// Register user
export const register = ({ usnm, eml, phnm, pswd }) => dispatch => {
	dispatch({ type: LOADING_REGISTER })

	// Setup config
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	}

	// Register details
	const details = JSON.stringify({ usnm, eml, phnm, pswd })

	axios
		.post("/api/account/register", details, config)
		.then(res => {
			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data
			})
			window.location.reload()
		})
		.catch(err => {
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					"REGISTER_FAIL"
				)
			)
			dispatch({ type: REGISTER_FAIL })
		})
}

// Log user in
export const login = ({ eml, pswd }) => dispatch => {
	dispatch({ type: LOADING_LOGIN })

	// Headers
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	}

	// Register details
	const details = JSON.stringify({ eml, pswd })

	axios
		.post("/api/account/login", details, config)
		.then(res => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data
			})
			window.location.reload()
		})
		.catch(err => {
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					"LOGIN_FAIL"
				)
			)
			dispatch({ type: LOGIN_FAIL })
		})
}

// Update pfp
export const updatePfp = ({ usnm, pfp, base64 }) => (dispatch, getState) => {
	const details = JSON.stringify({ usnm, pfp, base64 })
	if (base64) dispatch(savingpfp())
	else dispatch(deletingpfp())

	axios
		.put("/api/account/updatePfp", details, tokenConfig(getState))
		.then(_ => {
			if (base64) dispatch(savedpfp())
			else dispatch(deletedpfp())
			dispatch(GetUserData())
			dispatch(clearErrors())
		})
		.catch(console.error)
}

// Update pswd
export const updatePswd = ({ eml, pswd }) => (dispatch, getState) => {
	const details = JSON.stringify({ eml, pswd })
	dispatch(savingpswd())

	axios
		.put("/api/account/updatePswd", details, tokenConfig(getState))
		.then(_ => {
			dispatch(savedpswd())
			dispatch(clearErrors())
		})
		.catch(console.error)
}

// Delete user data
export const deleteUser = eml => (_dispatch, getState) => {
	axios
		.delete(`/api/account/deleteUser/${eml}`, tokenConfig(getState))
		.then(_ => {
			socket.emit("bc-req refresh-list")
			window.location.href = "/"
		})
}

// Log user out
export const logout = _ => dispatch => {
	dispatch({ type: LOGOUT_SUCCESS })
	dispatch(clearChats())
}

// Setup config/headers and token
export const tokenConfig = getState => {
	// Get token from localStorage
	const token = getState().auth.token
	// getState() gets the whole state of all the reducers set in reducers/index.js
	// auth refers to the authReducer and the pointer is in reducers/index.js
	// token refers to the state set in reducers/authReducer.js

	// Headers
	const config = {
		headers: {
			"Content-Type": "application/json"
		}
	}

	// If token, add to headers
	if (token) config.headers["x-auth-token"] = token

	return config
}
