import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import useAppDocument from "../../hooks/useAppDocument"

const _ChatContent = () => {
	const location = useLocation()
	const [chatId, setChatId] = useState<string | null>()

	const [chat] = useAppDocument("chats", chatId)

	useEffect(() => {
		if (location.hash && location.hash.startsWith("#/")) {
			setChatId(location.hash.slice(2))
		} else {
			setChatId(null)
		}
	}, [location.hash])

	return <></>
}

export default _ChatContent
