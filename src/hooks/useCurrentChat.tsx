import { useDebugValue, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import useAppDocument from "./useAppDocument"

const useCurrentChat = () => {
	const location = useLocation()
	const [chatId, setChatId] = useState<string | null>()

	const [chat] = useAppDocument("chats", chatId)

	useDebugValue(chat)

	useEffect(() => {
		if (location.hash && location.hash.startsWith("#/")) {
			setChatId(location.hash.slice(2))
		} else {
			setChatId(null)
		}
	}, [location.hash])

	return chat
}

export default useCurrentChat
