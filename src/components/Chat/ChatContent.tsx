import { CSSProperties, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import useAppDocument from "../../hooks/useAppDocument"

interface Props {
	style?: CSSProperties
}

const _ChatContent = (props: Props) => {
	const { style } = props

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

	return <div style={style}></div>
}

export default _ChatContent
