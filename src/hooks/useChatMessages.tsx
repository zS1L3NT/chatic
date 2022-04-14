import { limit, orderBy, where } from "firebase/firestore"
import { useDebugValue, useEffect, useState } from "react"

import useAppCollection from "./useAppCollection"

const useChatMessages = (chatId: string | null | undefined, max: number) => {
	const [maxChanged, setMaxChanged] = useState(false)
	const [cache, setCache] = useState<iMessage[] | null>(null)

	const [messages] = useAppCollection(
		"messages",
		where("chatId", "==", chatId || "-"),
		orderBy("date", "desc"),
		limit(max)
	)

	useDebugValue(cache)

	useEffect(() => {
		setMaxChanged(true)
	}, [max])

	useEffect(() => {
		if (!maxChanged) {
			setCache(messages)
		} else if (messages !== null) {
			setMaxChanged(false)
		}
	}, [messages, maxChanged])

	return cache ? [...cache].reverse() : null
}

export default useChatMessages
