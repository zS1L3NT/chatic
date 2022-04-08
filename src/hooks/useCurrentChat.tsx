import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import useAppDocument from "./useAppDocument"

const useCurrentChat = (): [string | null, iChat | null] => {
	const location = useLocation()
	const [chatId, setChatId] = useState<string | null>(null)

	const [chat] = useAppDocument("chats", chatId)

	useEffect(() => {
		if (location.hash.startsWith("#/")) {
			setChatId(location.hash.slice(2))
		} else {
			setChatId(null)
		}
	}, [location.hash])

	return [chatId, chat]
}

export default useCurrentChat
