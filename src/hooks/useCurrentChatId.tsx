import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const useCurrentChatId = (): string | null => {
	const location = useLocation()
	const [chatId, setChatId] = useState<string | null>(null)

	useEffect(() => {
		if (location.pathname.startsWith("/chat/")) {
			setChatId(location.pathname.slice(6))
		} else {
			setChatId(null)
		}
	}, [location.pathname])

	return chatId
}

export default useCurrentChatId
