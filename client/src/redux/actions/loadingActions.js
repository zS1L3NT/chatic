import {
	SAVING_PFP,
	SAVED_PFP,
	DELETING_PFP,
	DELETED_PFP,
	SAVING_PSWD,
	SAVED_PSWD
} from "./types"

export const savingpfp = _ => ({
	type: SAVING_PFP
})

export const savedpfp = _ => ({
	type: SAVED_PFP
})

export const deletingpfp = _ => ({
	type: DELETING_PFP
})

export const deletedpfp = _ => ({
	type: DELETED_PFP
})

export const savingpswd = _ => ({
	type: SAVING_PSWD
})

export const savedpswd = _ => ({
	type: SAVED_PSWD
})
