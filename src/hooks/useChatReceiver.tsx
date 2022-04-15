import { useContext, useDebugValue } from "react"

import AuthContext from "../contexts/AuthContext"
import { usersColl } from "../firebase"
import useAppDocument from "./useAppDocument"

const useChatReceiver = (chat: iChat | null | undefined) => {
	const user = useContext(AuthContext)
	const [receiver] = useAppDocument(usersColl, chat?.users.filter(id => id !== user?.id)[0])

	useDebugValue(receiver)

	return receiver
}

export default useChatReceiver
