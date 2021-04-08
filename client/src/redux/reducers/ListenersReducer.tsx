import { IPresence, IUser } from "../../Types"
import { ListenerActions } from "../ReduxTypes"

const initialState: {
	uids: string[]
	users: {
		[uid: string]: IUser
	}
	presences: {
		[uid: string]: IPresence
	}
} = {
	uids: [],
	users: {},
	presences: {}
}

const reducer = (state = initialState, action: ListenerActions) => {
	switch (action.type) {
		case "User data changed":
			return {
				...state,
				users: {
					...state.users,
					[action.user.uid]: action.user
				}
			}
		case "User presence changed":
			return {
				...state,
				presences: {
					...state.presences,
					[action.uid]: action.presence
				}
			}
		case "Listening to new UID...":
			if (state.uids.indexOf(action.uid) === -1) {
				return {
					...state,
					uids: [...state.uids, action.uid]
				}
			} else return state
		case "Removed listener for UID":
			return {
				...state,
				uids: state.uids.filter(uid => uid !== action.uid)
			}
		default:
			return state
	}
}

export default reducer
