import {
	CHANGED_CHAT,
	LIST_CHATS,
	CREATE_CONV_STATE,
	UPDATE_CHAT,
	INSERT_CHAT,
	CLEAR_CHATS,
	SET_TYPING,
	SET_READ,
	ADD_UNREAD,
	RESET_CHATBOT
} from "../actions/types"
import getDate from "../../getDate"

const initialState = {
	open: "ChatBot",
	list: {},
	conversations: {
		ChatBot: [
			{
				sender: "ChatBot",
				text: "Click on a chat to select a chat",
				date: getDate(),
				status: "read"
			}
		]
	}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case LIST_CHATS:
			return {
				...state,
				list: action.list
			}
		case CHANGED_CHAT:
			return {
				...state,
				open: action.newName
			}
		case UPDATE_CHAT:
			return {
				...state,
				conversations: {
					...state.conversations,
					[action.name]: action.conversations
				}
			}
		case CREATE_CONV_STATE:
			return {
				...state,
				conversations: {
					...state.conversations,
					[action.name]: []
				}
			}
		case INSERT_CHAT:
			return {
				...state,
				conversations: {
					...state.conversations,
					[action.name]: [
						...state.conversations[action.name],
						action.conversations
					]
				}
			}
		case SET_TYPING:
			return {
				...state,
				list: {
					...state.list,
					[action.name]: {
						...state.list[action.name],
						typing: action.status
					}
				}
			}
		case SET_READ:
			return {
				...state,
				list: {
					...state.list,
					[action.name]: {
						...state.list[action.name],
						unread: 0
					}
				}
			}
		case ADD_UNREAD:
			return {
				...state,
				list: {
					...state.list,
					[action.name]: {
						...state.list[action.name],
						unread: state.list[action.name].unread + 1
					}
				}
			}
		case CLEAR_CHATS:
			return {
				open: "ChatBot",
				list: {},
				conversations: {
					ChatBot: [
						{
							sender: "ChatBot",
							text: "Click on a chat to select a chat",
							date: getDate(),
							status: "read"
						},
						{
							sender: "ChatBot",
							text:
								"If you don't have any chats to click onto, add a friend",
							date: getDate(1),
							status: "read"
						},
						{
							sender: "ChatBot",
							text:
								"Your text box is disabled. Click on a chat to enable it",
							date: getDate(2),
							status: "read"
						}
					]
				}
			}
		case RESET_CHATBOT:
			return {
				...state,
				conversations: {
					...state.conversations,
					ChatBot: [
						{
							sender: "ChatBot",
							text: "Click on a chat to select a chat",
							date: getDate(),
							status: "read"
						},
						{
							sender: "ChatBot",
							text:
								"If you don't have any chats to click onto, add a friend",
							date: getDate(1),
							status: "read"
						},
						{
							sender: "ChatBot",
							text:
								"Your text box is disabled. Click on a chat to enable it",
							date: getDate(2),
							status: "read"
						}
					]
				}
			}
		default:
			return state
	}
}
