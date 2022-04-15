import { limit, orderBy, where } from "firebase/firestore"
import { useContext, useDebugValue, useEffect } from "react"

import ChatsContext from "../contexts/ChatsContext"
import { messagesColl } from "../firebase"
import useAppCollection from "./useAppCollection"

const useChatMessages = (chatId: string | null | undefined) => {
	const { messages, setChatMessages } = useContext(ChatsContext)

	const [dbMessages] = useAppCollection(
		messagesColl,
		where("chatId", "==", chatId || "-"),
		orderBy("date", "desc"),
		limit(40)
	)

	useDebugValue(messages)

	useEffect(() => {
		if (chatId && dbMessages) {
			setChatMessages(chatId, dbMessages)
		}
	}, [chatId, dbMessages])

	return chatId && messages[chatId]
		? Object.values(messages[chatId]!).sort((a, b) => b.date - a.date)
		: null
}

export default useChatMessages
