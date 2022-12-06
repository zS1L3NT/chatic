import { limit, orderBy, where } from "firebase/firestore"
import { useDebugValue, useEffect } from "react"

import { messagesColl } from "../firebase"
import { remove_messages, set_messages } from "../slices/MessagesSlice"
import useAppCollection from "./useAppCollection"
import useAppDispatch from "./useAppDispatch"
import useAppSelector from "./useAppSelector"
import useOnUpdate from "./useOnUpdate"

const useChatMessages = (chatId: string | null | undefined) => {
	const [dbMessages] = useAppCollection(
		messagesColl,
		where("chatId", "==", chatId || "-"),
		orderBy("date", "desc"),
		limit(40)
	)

	const dispatch = useAppDispatch()
	const chatMessages = useAppSelector(state => state.messages[chatId!])

	useDebugValue(chatMessages)

	useEffect(() => {
		if (chatId && dbMessages) {
			const removableMessages = dbMessages
				.filter(message => message.content === null)
				.map(message => message.id)
			if (removableMessages.length) {
				dispatch(
					remove_messages({
						chatId,
						messageIds: removableMessages
					})
				)
			}

			dispatch(
				set_messages({
					chatId,
					messages: dbMessages.filter(message => message.content !== null)
				})
			)
		}
	}, [chatId, dbMessages])

	return useOnUpdate(
		chatId && chatMessages ? Object.values(chatMessages).sort((a, b) => b.date - a.date) : null
	)
}

export default useChatMessages
