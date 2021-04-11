import { GETTING_ERRORS, CLEARED_ERRORS } from "./types"

// RETURN ERRORS
export const returnErrors = (msg, status, id = null) => ({
	type: GETTING_ERRORS,
	payload: { msg, status, id }
})

export const clearErrors = _ => ({
	type: CLEARED_ERRORS
})
