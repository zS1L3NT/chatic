import { limit, orderBy, where } from "firebase/firestore"
import { useDebugValue } from "react"

import useAppCollection from "./useAppCollection"

const useChatMessages = (chatId: string | null | undefined, max: number) => {
	const [messages] = useAppCollection(
		"messages",
		where("chatId", "==", chatId || "-"),
		orderBy("date", "desc"),
		limit(max)
	)

	useDebugValue(messages)

	return messages ? Array.from(messages).reverse() : null
}

export default useChatMessages
