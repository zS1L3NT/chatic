import { IMessage } from "../../Types"
import { MessageActions } from "../ReduxTypes"

const initialState: {
	[cid: string]: {
		[mid: string]: IMessage
	}
} = {}

const reducer = (state = initialState, action: MessageActions) => {
	switch (action.type) {
		case "Chat was updated":
			const messages: { [mid: string]: IMessage } = {}
			action.messages.forEach(message => {
				messages[message.mid] = message
			})

			return {
				...state,
				[action.cid]: messages
			}
		default:
			return state
	}
}

export default reducer
