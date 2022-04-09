import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const useCurrentChatId = (): string | null => {
	const location = useLocation()
	const [chatId, setChatId] = useState<string | null>(null)

	useEffect(() => {
		if (location.hash.startsWith("#/")) {
			setChatId(location.hash.slice(2))
		} else {
			setChatId(null)
		}
	}, [location.hash])

	return chatId
}

export default useCurrentChatId
