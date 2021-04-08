import { IPresence, IUser } from "../../Types"
import { IAddUIDToListening, IRemoveUIDFromListening, ISetListenedPresence, ISetListenedUser } from "../ReduxTypes"

export const AddUIDToListening = (uid: string): IAddUIDToListening => {
	return {
		type: "Listening to new UID...",
		uid
	}
}

export const RemoveUIDFromListening = (uid: string): IRemoveUIDFromListening => {
	return {
		type: "Removed listener for UID",
		uid
	}
}

export const SetListenedUser = (user: IUser): ISetListenedUser => ({
	type: "User data changed",
	user
})

export const SetListenedPresence = (uid: string, presence: IPresence): ISetListenedPresence => ({
	type: "User presence changed",
	uid,
	presence
})