import {
	CHANGED_CHAT,
	UPDATE_CHAT,
	LIST_CHATS,
	CREATE_CONV_STATE,
	INSERT_CHAT,
	CLEAR_CHATS,
	SET_TYPING,
	SET_READ,
	ADD_UNREAD,
	RESET_CHATBOT
} from "../actions/types"
import { socket } from "../../App"

export const changeChat = (newName, user) => dispatch => {
	dispatch({ type: CHANGED_CHAT, newName })
	if (newName !== "ChatBot" && newName !== "" && newName[0] !== "[") {
		socket.emit("bc-req set-chat-read", {
			reader: user,
			sender: newName
		})
	}
}

export const createConvState = name => ({
	type: CREATE_CONV_STATE,
	name
})

export const insertChat = (name, conversations) => ({
	type: INSERT_CHAT,
	name,
	conversations
})

export const listChats = list => ({
	type: LIST_CHATS,
	list
})

export const updateChat = (name, conversations) => ({
	type: UPDATE_CHAT,
	name,
	conversations
})

export const setTyping = (name, status) => ({
	type: SET_TYPING,
	name,
	status
})

export const setRead = name => ({
	type: SET_READ,
	name
})

export const addUnread = name => ({
	type: ADD_UNREAD,
	name
})

export const clearChats = _ => ({
	type: CLEAR_CHATS
})

export const resetChatBot = _ => ({
	type: RESET_CHATBOT
})
