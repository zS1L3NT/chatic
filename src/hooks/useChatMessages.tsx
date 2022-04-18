import { limit, orderBy, where } from "firebase/firestore"
import { useContext, useDebugValue, useEffect } from "react"

import ChatsContext from "../contexts/ChatsContext"
import { messagesColl } from "../firebase"
import useAppCollection from "./useAppCollection"
import useOnUpdate from "./useOnUpdate"

const useChatMessages = (chatId: string | null | undefined) => {
	const { getChatMessages, setChatMessages, removeChatMessages } = useContext(ChatsContext)

	const chatMessages = useOnUpdate(getChatMessages(chatId))
	const [dbMessages] = useAppCollection(
		messagesColl,
		where("chatId", "==", chatId || "-"),
		orderBy("date", "desc"),
		limit(40)
	)

	useDebugValue(chatMessages)

	useEffect(() => {
		if (chatId && dbMessages) {
			removeChatMessages(
				chatId,
				dbMessages.filter(message => message.content === null).map(message => message.id)
			)
			setChatMessages(
				chatId,
				dbMessages.filter(message => message.content !== null)
			)
		}
	}, [chatId, dbMessages])

	return chatId ? Object.values(chatMessages).sort((a, b) => b.date - a.date) : null
}

export default useChatMessages
